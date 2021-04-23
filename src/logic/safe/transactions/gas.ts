import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { List } from 'immutable'

import { getRpcServiceUrl, usesInfuraRPC } from 'src/config'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf, EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { getWeb3, web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { fetchSafeTxGasEstimation } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checksumAddress } from 'src/utils/checksumAddress'
import { sameString } from 'src/utils/strings'

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

type SafeTxGasEstimationProps = {
  safeAddress: string
  txData: string
  txRecipient: string
  txAmount: string
  operation: number
}

export const estimateSafeTxGas = async ({
  safeAddress,
  txData,
  txRecipient,
  txAmount,
  operation,
}: SafeTxGasEstimationProps): Promise<number> => {
  try {
    const safeTxGasEstimation = await fetchSafeTxGasEstimation({
      safeAddress,
      to: checksumAddress(txRecipient),
      value: txAmount,
      data: txData,
      operation,
    })

    return parseInt(safeTxGasEstimation)
  } catch (error) {
    console.info('Error calculating tx gas estimation', error.message)
    throw error
  }
}

type TransactionEstimationProps = {
  txData: string
  safeAddress: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount: string
  operation: number
  gasPrice?: string
  gasToken?: string
  refundReceiver?: string // Address of receiver of gas payment (or 0 if tx.origin).
  safeTxGas?: number
  from?: string
  isExecution: boolean
  isOffChainSignature?: boolean
  approvalAndExecution?: boolean
}

export const estimateTransactionGasLimit = async ({
  txData,
  safeAddress,
  txRecipient,
  txConfirmations,
  txAmount,
  operation,
  gasPrice,
  gasToken,
  refundReceiver,
  safeTxGas,
  from,
  isExecution,
  isOffChainSignature = false,
  approvalAndExecution,
}: TransactionEstimationProps): Promise<number> => {
  if (!from) {
    throw new Error('No from provided for approving or execute transaction')
  }

  if (isExecution) {
    return estimateGasForTransactionExecution({
      safeAddress,
      txRecipient,
      txConfirmations,
      txAmount,
      txData,
      operation,
      from,
      gasPrice: gasPrice || '0',
      gasToken: gasToken || ZERO_ADDRESS,
      refundReceiver: refundReceiver || ZERO_ADDRESS,
      safeTxGas: safeTxGas || 0,
      approvalAndExecution,
    })
  }

  return estimateGasForTransactionApproval({
    safeAddress,
    operation,
    txData,
    txAmount,
    txRecipient,
    from,
    isOffChainSignature,
  })
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
  gasLimit?: string
  refundReceiver: string // Address of receiver of gas payment (or 0 if tx.origin).
  safeTxGas: number
  from: string
  approvalAndExecution?: boolean
}

const estimateGasForTransactionExecution = async ({
  safeAddress,
  txRecipient,
  txConfirmations,
  txAmount,
  txData,
  operation,
  from,
  gasPrice,
  gasToken,
  refundReceiver,
  safeTxGas,
  approvalAndExecution,
}: TransactionExecutionEstimationProps): Promise<number> => {
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)
  // If it's approvalAndExecution we have to add a preapproved signature else we have all signatures
  const sigs = generateSignaturesFromTxConfirmations(txConfirmations, approvalAndExecution ? from : undefined)

  const estimationData = safeInstance.methods
    .execTransaction(txRecipient, txAmount, txData, operation, safeTxGas, 0, gasPrice, gasToken, refundReceiver, sigs)
    .encodeABI()

  return calculateGasOf({
    data: estimationData,
    from,
    to: safeAddress,
  })
}

export const checkTransactionExecution = async ({
  safeAddress,
  txRecipient,
  txConfirmations,
  txAmount,
  txData,
  operation,
  from,
  gasPrice,
  gasToken,
  gasLimit,
  refundReceiver,
  safeTxGas,
  approvalAndExecution,
}: TransactionExecutionEstimationProps): Promise<boolean> => {
  const safeInstance = getGnosisSafeInstanceAt(safeAddress)
  // If it's approvalAndExecution we have to add a preapproved signature else we have all signatures
  const sigs = generateSignaturesFromTxConfirmations(txConfirmations, approvalAndExecution ? from : undefined)

  return safeInstance.methods
    .execTransaction(txRecipient, txAmount, txData, operation, safeTxGas, 0, gasPrice, gasToken, refundReceiver, sigs)
    .call({
      from,
      gas: gasLimit,
    })
    .catch(() => false)
}

type TransactionApprovalEstimationProps = {
  safeAddress: string
  txRecipient: string
  txAmount: string
  txData: string
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

  const safeInstance = getGnosisSafeInstanceAt(safeAddress)

  const nonce = await safeInstance.methods.nonce().call()
  const txHash = await safeInstance.methods
    .getTransactionHash(txRecipient, txAmount, txData, operation, 0, 0, 0, ZERO_ADDRESS, ZERO_ADDRESS, nonce)
    .call({
      from,
    })
  const approveTransactionTxData = safeInstance.methods.approveHash(txHash).encodeABI()
  return calculateGasOf({
    data: approveTransactionTxData,
    from,
    to: safeAddress,
  })
}
