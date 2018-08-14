// @flow
import { calculateGasOf, checkReceiptStatus, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { type Operation, submitOperation } from '~/logic/safe/safeTxHistory'
import { getDailyLimitModuleFrom } from '~/logic/contracts/dailyLimitContracts'
import { getSafeEthereumInstance } from '~/logic/safe/safeFrontendOperations'

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

export const executeDailyLimit = async (
  safeAddress: string,
  to: string,
  nonce: number,
  valueInWei: number,
  sender: string,
) => {
  const dailyLimitModule = await getDailyLimitModuleFrom(safeAddress)
  const dailyLimitData = dailyLimitModule.contract.executeDailyLimit.getData(0, to, valueInWei)
  const gas = await calculateGasOf(dailyLimitData, sender, dailyLimitModule.address)
  const gasPrice = await calculateGasPrice()

  const txHash = await dailyLimitModule.executeDailyLimit(0, to, valueInWei, { from: sender, gas, gasPrice })
  checkReceiptStatus(txHash.tx)

  const operation = 0 // CALL for all currencies
  const data = '' // empty for ETH
  await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'execution')

  return txHash
}
