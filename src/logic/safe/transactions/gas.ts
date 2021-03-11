import { BigNumber } from 'bignumber.js'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf, EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { List } from 'immutable'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import axios from 'axios'
import { getRpcServiceUrl, usesInfuraRPC } from 'src/config'
import { sameString } from 'src/utils/strings'

// 21000 - additional gas costs (e.g. base tx costs, transfer costs)
export const MINIMUM_TRANSACTION_GAS = 21000
// Estimation of gas required for each signature (aproximately 7800, roundup to 8000)
export const GAS_REQUIRED_PER_SIGNATURE = 8000
// We require some gas to emit the events (at least 2500) after the execution and some to perform code until the execution (500)
// We also add 3k pay when processing safeTxGas value. We don't know this value when creating the transaction
// Hex values different than 0 has some gas cost
export const SAFE_TX_GAS_DATA_COST = 6000

// Receives the response data of the safe method requiredTxGas() and parses it to get the gas amount
const parseRequiredTxGasResponse = (data: string): number => {
  const reducer = (accumulator, currentValue) => {
    if (currentValue === EMPTY_DATA) {
      return accumulator + 0
    }

    if (currentValue === '00') {
      return accumulator + 4
    }

    return accumulator + 16
  }

  return data.match(/.{2}/g)?.reduce(reducer, 0)
}

interface ErrorDataJson extends JSON {
  originalError?: {
    data?: string
  }
  data?: string
}

const getJSONOrNullFromString = (stringInput: string): ErrorDataJson | null => {
  try {
    return JSON.parse(stringInput)
  } catch (error) {
    return null
  }
}

// Parses the result from the error message (GETH, OpenEthereum/Parity and Nethermind) and returns the data value
export const getDataFromNodeErrorMessage = (errorMessage: string): string | undefined => {
  // Replace illegal characters that often comes within the error string (like � for example)
  // https://stackoverflow.com/questions/12754256/removing-invalid-characters-in-javascript
  const normalizedErrorString = errorMessage.replace(/\uFFFD/g, '')

  // Extracts JSON object from the error message
  const [, ...error] = normalizedErrorString.split('\n')

  try {
    const errorAsString = error.join('')
    const errorAsJSON = getJSONOrNullFromString(errorAsString)

    // Trezor wallet returns the error not as an JSON object but directly as string
    if (!errorAsJSON) {
      return errorAsString.length ? errorAsString : undefined
    }

    // For new GETH nodes they will return the data as error in the format:
    // {
    //   "originalError": {
    //     "code": number,
    //     "data": string,
    //     "message": "execution reverted: ..."
    //   }
    // }
    if (errorAsJSON.originalError && errorAsJSON.originalError.data) {
      return errorAsJSON.originalError.data
    }

    // OpenEthereum/Parity nodes will return the data as error in the format:
    // {
    //     "error": {
    //         "code": number,
    //         "message": string,
    //         "data": "revert: 0x..." -> this is the result data that should be extracted from the message
    //      },
    //     "id": number
    // }
    if (errorAsJSON?.data) {
      const [, dataResult] = errorAsJSON.data.split(' ')
      return dataResult
    }
  } catch (error) {
    console.error(`Error trying to extract data from node error message: ${errorMessage}`)
  }
}

const estimateGasWithWeb3Provider = async (txConfig: {
  to: string
  from: string
  data: string
  gasPrice?: number
  gas?: number
}): Promise<number> => {
  const web3 = getWeb3()
  try {
    const result = await web3.eth.call(txConfig)

    // GETH Nodes (geth version < v1.9.24)
    // In case that the gas is not enough we will receive an EMPTY data
    // Otherwise we will receive the gas amount as hash data -> this is valid for old versions of GETH nodes ( < v1.9.24)

    if (!sameString(result, EMPTY_DATA)) {
      return new BigNumber(result.substring(138), 16).toNumber()
    }
  } catch (error) {
    // So we try to extract the estimation result within the error in case is possible
    const estimationData = getDataFromNodeErrorMessage(error.message)

    if (!estimationData || sameString(estimationData, EMPTY_DATA)) {
      throw error
    }

    return new BigNumber(estimationData.substring(138), 16).toNumber()
  }
  throw new Error('Error while estimating the gas required for tx')
}

const estimateGasWithRPCCall = async (txConfig: {
  to: string
  from: string
  data: string
  gasPrice?: number
  gas?: number
}): Promise<number> => {
  try {
    const { data } = await axios.post(getRpcServiceUrl(), {
      jsonrpc: '2.0',
      method: 'eth_call',
      id: 1,
      params: [
        {
          ...txConfig,
          gasPrice: web3ReadOnly.utils.toHex(txConfig.gasPrice || 0),
          gas: txConfig.gas ? web3ReadOnly.utils.toHex(txConfig.gas) : undefined,
        },
        'latest',
      ],
    })

    const { error } = data
    if (error?.data) {
      return new BigNumber(error.data.substring(138), 16).toNumber()
    }
  } catch (error) {
    console.log('Gas estimation endpoint errored: ', error.message)
  }
  throw new Error('Error while estimating the gas required for tx')
}

export const getGasEstimationTxResponse = async (txConfig: {
  to: string
  from: string
  data: string
  gasPrice?: number
  gas?: number
}): Promise<number> => {
  // If we are in a infura supported network we estimate using infura
  if (usesInfuraRPC) {
    return estimateGasWithRPCCall(txConfig)
  }
  // Otherwise we estimate using the current connected provider
  return estimateGasWithWeb3Provider(txConfig)
}

const calculateMinimumGasForTransaction = async (
  additionalGasBatches: number[],
  safeAddress: string,
  estimateData: string,
  safeTxGasEstimation: number,
  fixedGasCosts: number,
): Promise<number> => {
  for (const additionalGas of additionalGasBatches) {
    const batchedSafeTxGas = safeTxGasEstimation + additionalGas
    // To simulate if safeTxGas is enough we need to send an estimated gasLimit that will be the sum
    // of the safeTxGasEstimation and fixedGas costs for ethereum transaction
    const gasLimit = batchedSafeTxGas + fixedGasCosts
    console.info(`Estimating safeTxGas with gas amount: ${batchedSafeTxGas}`)
    try {
      const estimation = await getGasEstimationTxResponse({
        to: safeAddress,
        from: safeAddress,
        data: estimateData,
        gasPrice: 0,
        gas: gasLimit,
      })
      if (estimation > 0) {
        console.info(`Gas estimation successfully finished with gas amount: ${batchedSafeTxGas}`)
        return batchedSafeTxGas
      }
    } catch (error) {
      console.log(`Error trying to estimate gas with amount: ${batchedSafeTxGas}`)
    }
  }

  return 0
}

export const getFixedGasCosts = (threshold: number): number => {
  // There are some minimum gas costs to execute an Ethereum transaction
  // We add this fixed network minimum gas, the gas required to check each signature
  return MINIMUM_TRANSACTION_GAS + (threshold || 1) * GAS_REQUIRED_PER_SIGNATURE
}

export const estimateGasForTransactionCreation = async (
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: string,
  operation: number,
  safeTxGas?: number,
): Promise<number> => {
  try {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

    const estimateData = safeInstance.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const threshold = await safeInstance.methods.getThreshold().call()

    const fixedGasCosts = getFixedGasCosts(Number(threshold))

    const gasEstimationResponse = await getGasEstimationTxResponse({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
      gas: safeTxGas ? safeTxGas + fixedGasCosts : undefined,
    })

    if (safeTxGas) {
      // When we execute we get a more precise estimate value, we log for debug purposes
      console.info('This is the smart contract minimum expected safeTxGas', gasEstimationResponse)
      // We return set safeTxGas
      return safeTxGas
    }

    const dataGasEstimation = parseRequiredTxGasResponse(estimateData)
    // Adding this values we should get the full safeTxGas value
    const safeTxGasEstimation = gasEstimationResponse + dataGasEstimation + SAFE_TX_GAS_DATA_COST
    // We will add gas batches in case is not enough
    const additionalGasBatches = [0, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    return await calculateMinimumGasForTransaction(
      additionalGasBatches,
      safeAddress,
      estimateData,
      safeTxGasEstimation,
      fixedGasCosts,
    )
  } catch (error) {
    console.info('Error calculating tx gas estimation', error.message)
    throw error
  }
}

type TransactionExecutionEstimationProps = {
  txData: string
  safeAddress: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount: string
  operation: number
  gasPrice: string
  gasToken: string
  refundReceiver: string // Address of receiver of gas payment (or 0 if tx.origin).
  safeTxGas: number
  from: string
  approvalAndExecution?: boolean
}

export const estimateGasForTransactionExecution = async ({
  safeAddress,
  txRecipient,
  txConfirmations,
  txAmount,
  txData,
  operation,
  gasPrice,
  gasToken,
  refundReceiver,
  safeTxGas,
  approvalAndExecution,
}: TransactionExecutionEstimationProps): Promise<number> => {
  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  try {
    let gasEstimation
    // If safeTxGas === 0 we still have to estimate the gas limit to execute the transaction so we need to get an estimation
    if (approvalAndExecution || safeTxGas === 0) {
      console.info(`Estimating transaction necessary gas...`)
      // @todo (agustin) once we solve the problem with the preApprovingOwner, we need to use the method bellow (execTransaction) with sigs = generateSignaturesFromTxConfirmations(txConfirmations,from)
      gasEstimation = await estimateGasForTransactionCreation(
        safeAddress,
        txData,
        txRecipient,
        txAmount,
        operation,
        safeTxGas,
      )

      if (approvalAndExecution) {
        // If it's approve and execute we don't have all the signatures to do a complete simulation, we return the gas estimation
        console.info(`Gas estimation successfully finished with gas amount: ${gasEstimation}`)
        return gasEstimation
      }
    }
    // If we have all signatures we can do a call to ensure the transaction will be successful or fail
    const sigs = generateSignaturesFromTxConfirmations(txConfirmations)
    console.info(`Check transaction success with gas amount: ${safeTxGas}...`)
    await safeInstance.methods
      .execTransaction(txRecipient, txAmount, txData, operation, safeTxGas, 0, gasPrice, gasToken, refundReceiver, sigs)
      .call()
    console.info(`Gas estimation successfully finished with gas amount: ${safeTxGas}`)
    return safeTxGas || gasEstimation
  } catch (error) {
    throw new Error(`Gas estimation failed with gas amount: ${safeTxGas}`)
  }
}

type TransactionApprovalEstimationProps = {
  txData: string
  safeAddress: string
  txRecipient: string
  txAmount: string
  operation: number
  from: string
  isOffChainSignature: boolean
}

export const estimateGasForTransactionApproval = async ({
  safeAddress,
  txRecipient,
  txAmount,
  txData,
  operation,
  from,
  isOffChainSignature,
}: TransactionApprovalEstimationProps): Promise<number> => {
  if (isOffChainSignature) {
    return 0
  }

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

  const nonce = await safeInstance.methods.nonce().call()
  const txHash = await safeInstance.methods
    .getTransactionHash(txRecipient, txAmount, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
    .call({
      from,
    })
  const approveTransactionTxData = await safeInstance.methods.approveHash(txHash).encodeABI()
  return calculateGasOf({
    data: approveTransactionTxData,
    from,
    to: safeAddress,
  })
}
