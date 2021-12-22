import { List } from 'immutable'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf } from 'src/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { fetchSafeTxGasEstimation } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checksumAddress } from 'src/utils/checksumAddress'
import { hasFeature } from '../utils/safeVersion'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

type SafeTxGasEstimationProps = {
  safeAddress: string
  txData: string
  txRecipient: string
  txAmount: string
  operation: number
}

export const estimateSafeTxGas = async (
  { safeAddress, txData, txRecipient, txAmount, operation }: SafeTxGasEstimationProps,
  safeVersion: string,
): Promise<string> => {
  if (hasFeature(FEATURES.SAFE_TX_GAS_OPTIONAL, safeVersion)) {
    return '0'
  }

  try {
    const { safeTxGas } = await fetchSafeTxGasEstimation({
      safeAddress,
      to: checksumAddress(txRecipient),
      value: txAmount,
      data: txData,
      operation,
    })

    return safeTxGas
  } catch (error) {
    console.info('Error calculating tx gas estimation', error.message)
    throw error
  }
}

type TransactionEstimationProps = {
  txData: string
  safeAddress: string
  safeVersion: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount: string
  operation: number
  gasPrice?: string
  gasToken?: string
  refundReceiver?: string // Address of receiver of gas payment (or 0 if tx.origin).
  safeTxGas?: string
  from?: string
  isExecution: boolean
  isOffChainSignature?: boolean
  approvalAndExecution?: boolean
}

export const estimateTransactionGasLimit = async ({
  txData,
  safeAddress,
  safeVersion,
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
      safeVersion,
      txRecipient,
      txConfirmations,
      txAmount,
      txData,
      operation,
      from,
      gasPrice: gasPrice || '0',
      gasToken: gasToken || ZERO_ADDRESS,
      refundReceiver: refundReceiver || ZERO_ADDRESS,
      safeTxGas: safeTxGas || '0',
      approvalAndExecution,
    })
  }

  return estimateGasForTransactionApproval({
    safeAddress,
    safeVersion,
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
  safeVersion: string
  txRecipient: string
  txConfirmations?: List<Confirmation>
  txAmount: string
  operation: number
  gasPrice: string
  gasToken: string
  gasLimit?: string
  refundReceiver: string // Address of receiver of gas payment (or 0 if tx.origin).
  safeTxGas: string
  from: string
  approvalAndExecution?: boolean
}

const estimateGasForTransactionExecution = async ({
  safeAddress,
  safeVersion,
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
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
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
  safeVersion,
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
  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)
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
  safeVersion: string
  txRecipient: string
  txAmount: string
  txData: string
  operation: number
  from: string
  isOffChainSignature: boolean
}

export const estimateGasForTransactionApproval = async ({
  safeAddress,
  safeVersion,
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

  const safeInstance = getGnosisSafeInstanceAt(safeAddress, safeVersion)

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

export const getGasParam = (): string => {
  return hasFeature(FEATURES.EIP1559) ? 'maxFeePerGas' : 'gasPrice'
}
