import { BigNumber } from 'bignumber.js'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf, EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { sameString } from 'src/utils/strings'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { List } from 'immutable'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'

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

export const getGasEstimationTxResponse = async (txConfig: {
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

  // This will fail in case that we receive an EMPTY_DATA on the GETH node gas estimation (for version < v1.9.24 of geth nodes)
  // We cannot throw this error above because it will be captured again on the catch block bellow
  throw new Error('Error while estimating the gas required for tx')
}

const calculateMinimumGasForTransaction = async (
  additionalGasBatches: number[],
  safeAddress: string,
  estimateData: string,
  txGasEstimation: number,
  dataGasEstimation: number,
): Promise<number> => {
  for (const additionalGas of additionalGasBatches) {
    const amountOfGasToTryTx = txGasEstimation + dataGasEstimation + additionalGas
    console.info(`Estimating transaction creation with gas amount: ${amountOfGasToTryTx}`)
    try {
      await getGasEstimationTxResponse({
        to: safeAddress,
        from: safeAddress,
        data: estimateData,
        gasPrice: 0,
        gas: amountOfGasToTryTx,
      })
      console.info(`Gas estimation successfully finished with gas amount: ${amountOfGasToTryTx}`)
      return amountOfGasToTryTx
    } catch (error) {
      console.log(`Error trying to estimate gas with amount: ${amountOfGasToTryTx}`)
    }
  }

  return 0
}

export const estimateGasForTransactionCreation = async (
  safeAddress: string,
  data: string,
  to: string,
  valueInWei: string,
  operation: number,
): Promise<number> => {
  try {
    const safeInstance = await getGnosisSafeInstanceAt(safeAddress)

    const estimateData = safeInstance.methods.requiredTxGas(to, valueInWei, data, operation).encodeABI()
    const gasEstimationResponse = await getGasEstimationTxResponse({
      to: safeAddress,
      from: safeAddress,
      data: estimateData,
    })

    // 21000 - additional gas costs (e.g. base tx costs, transfer costs)
    const dataGasEstimation = parseRequiredTxGasResponse(estimateData) + 21000
    const additionalGasBatches = [0, 10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000]

    return await calculateMinimumGasForTransaction(
      additionalGasBatches,
      safeAddress,
      estimateData,
      gasEstimationResponse,
      dataGasEstimation,
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
    if (approvalAndExecution) {
      console.info(`Estimating transaction success for execution & approval...`)
      // @todo (agustin) once we solve the problem with the preApprovingOwner, we need to use the method bellow (execTransaction) with sigs = generateSignaturesFromTxConfirmations(txConfirmations,from)
      const gasEstimation = await estimateGasForTransactionCreation(
        safeAddress,
        txData,
        txRecipient,
        txAmount,
        operation,
      )
      console.info(`Gas estimation successfully finished with gas amount: ${gasEstimation}`)
      return gasEstimation
    }
    const sigs = generateSignaturesFromTxConfirmations(txConfirmations)
    console.info(`Estimating transaction success for with gas amount: ${safeTxGas}...`)
    await safeInstance.methods
      .execTransaction(txRecipient, txAmount, txData, operation, safeTxGas, 0, gasPrice, gasToken, refundReceiver, sigs)
      .call()

    console.info(`Gas estimation successfully finished with gas amount: ${safeTxGas}`)
    return safeTxGas
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
