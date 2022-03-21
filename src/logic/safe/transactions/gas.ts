import { List } from 'immutable'
import { FEATURES } from '@gnosis.pm/safe-react-gateway-sdk'

import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { calculateGasOf } from 'src/logic/wallets/ethTransactions'
import { generateSignaturesFromTxConfirmations } from 'src/logic/safe/safeTxSigner'
import { fetchSafeTxGasEstimation } from 'src/logic/safe/api/fetchSafeTxGasEstimation'
import { Confirmation } from 'src/logic/safe/store/models/types/confirmation'
import { checksumAddress } from 'src/utils/checksumAddress'
import { hasFeature } from '../utils/safeVersion'
import { PayableTx } from 'src/types/contracts/types'
import { TxParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'

export type SafeTxGasEstimationProps = {
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

export const estimateGasForTransactionExecution = async ({
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
    .then(() => true)
    .catch((e) => {
      console.warn('Transaction will fail\n\n', e)
      return false
    })
}

export const isMaxFeeParam = (): boolean => {
  return hasFeature(FEATURES.EIP1559)
}

export const createSendParams = (
  from: string,
  txParams: Pick<TxParameters, 'ethGasLimit' | 'ethNonce' | 'ethMaxPrioFeeInGWei' | 'ethGasPriceInGWei'>,
): PayableTx => {
  const sendParams: PayableTx = {
    from,
    value: 0,
    gas: txParams.ethGasLimit,
    nonce: txParams.ethNonce,
  }

  if (isMaxFeeParam()) {
    sendParams.maxPriorityFeePerGas = txParams.ethMaxPrioFeeInGWei
    sendParams.maxFeePerGas = txParams.ethGasPriceInGWei
  } else {
    sendParams.gasPrice = txParams.ethGasPriceInGWei
  }

  return sendParams
}
