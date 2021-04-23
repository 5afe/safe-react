import { List } from 'immutable'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf } from 'src/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { fetchSafeTxGasEstimation } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checksumAddress } from 'src/utils/checksumAddress'

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
