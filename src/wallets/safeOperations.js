// @flow
import { getSafeEthereumInstance } from '~/wallets/createTransactions'
import { calculateGasOf, checkReceiptStatus, calculateGasPrice } from '~/wallets/ethTransactions'
import { type Operation, submitOperation } from '~/wallets/safeTxHistory'

export const approveTransaction = async (
  safeAddress: string,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: number,
  sender: string,
) => {
  const gasPrice = await calculateGasPrice()

  const gnosisSafe = await getSafeEthereumInstance(safeAddress)
  const txData = gnosisSafe.contract.approveTransactionWithParameters.getData(to, valueInWei, data, operation, nonce)
  const gas = await calculateGasOf(txData, sender, safeAddress)
  const txReceipt = await gnosisSafe
    .approveTransactionWithParameters(to, valueInWei, data, operation, nonce, { from: sender, gas, gasPrice })
  const txHash = txReceipt.tx
  await checkReceiptStatus(txHash)

  await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'confirmation')

  return txHash
}

export const executeTransaction = async (
  safeAddress: string,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: number,
  sender: string,
) => {
  const gasPrice = await calculateGasPrice()

  const gnosisSafe = await getSafeEthereumInstance(safeAddress)
  const txConfirmationData =
    gnosisSafe.contract.execTransactionIfApproved.getData(to, valueInWei, data, operation, nonce)
  const gas = await calculateGasOf(txConfirmationData, sender, safeAddress)

  const txReceipt =
    await gnosisSafe.execTransactionIfApproved(to, valueInWei, data, operation, nonce, { from: sender, gas, gasPrice })
  const txHash = txReceipt.tx
  await checkReceiptStatus(txHash)

  await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'execution')

  return txHash
}
