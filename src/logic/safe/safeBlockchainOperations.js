// @flow
import { calculateGasOf, checkReceiptStatus, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { type Operation, submitOperation } from '~/logic/safe/safeTxHistory'
import { getDailyLimitModuleFrom } from '~/logic/contracts/dailyLimitContracts'
import { getSafeEthereumInstance } from '~/logic/safe/safeFrontendOperations'
import { generateMetamaskSignature, generateTxGasEstimateFrom, estimateDataGas } from '~/logic/safe/safeTxSigner'
import { storeSignature, getSignaturesFrom } from '~/utils/localStorage/signatures'
import { signaturesViaMetamask } from '~/config'

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

  if (signaturesViaMetamask()) {
    const safe = await getSafeEthereumInstance(safeAddress)
    const txGasEstimate = await generateTxGasEstimateFrom(safe, safeAddress, data, to, valueInWei, operation)
    const signature =
      await generateMetamaskSignature(safe, safeAddress, sender, to, valueInWei, nonce, data, operation, txGasEstimate)
    storeSignature(safeAddress, nonce, signature)
  }

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

  if (signaturesViaMetamask()) {
    const safe = await getSafeEthereumInstance(safeAddress)
    const txGasEstimate = await generateTxGasEstimateFrom(safe, safeAddress, data, to, valueInWei, operation)
    const signature =
      await generateMetamaskSignature(safe, safeAddress, sender, to, valueInWei, nonce, data, operation, txGasEstimate)
    storeSignature(safeAddress, nonce, signature)

    const sigs = getSignaturesFrom(safeAddress, nonce)

    const threshold = await safe.getThreshold()
    const gas = await estimateDataGas(safe, to, valueInWei, data, operation, txGasEstimate, 0, nonce, Number(threshold))
    const numOwners = await safe.getOwners()
    const gasIncludingRemovingStoreUpfront = gas + txGasEstimate + (numOwners.length * 15000)

    const txReceipt = await safe.execTransactionAndPaySubmitter(
      to,
      valueInWei,
      data,
      operation,
      txGasEstimate,
      0,
      0,
      0,
      sigs,
      { from: sender, gas: gasIncludingRemovingStoreUpfront, gasPrice },
    )

    const txHash = txReceipt.tx
    await checkReceiptStatus(txHash)
    // await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'execution')

    return txHash
  }

  const gnosisSafe = await getSafeEthereumInstance(safeAddress)
  const txConfirmationData =
    gnosisSafe.contract.execTransactionIfApproved.getData(to, valueInWei, data, operation, nonce)
  const numOwners = await gnosisSafe.getOwners()
  const gas = await calculateGasOf(txConfirmationData, sender, safeAddress)
  const gasIncludingRemovingStoreUpfront = gas + (numOwners.length * 15000)
  const txReceipt = await gnosisSafe.execTransactionIfApproved(
    to,
    valueInWei,
    data,
    operation,
    nonce,
    { from: sender, gas: gasIncludingRemovingStoreUpfront, gasPrice },
  )
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

  const txReceipt = await dailyLimitModule.executeDailyLimit(0, to, valueInWei, { from: sender, gas, gasPrice })
  checkReceiptStatus(txReceipt.tx)

  /*
  // Temporarily disabled for daily limit operations
  const operation = 0 // CALL for all currencies
  const data = '' // empty for ETH

  await submitOperation(safeAddress, to, Number(valueInWei), data, operation, nonce, txReceipt.tx, sender, 'execution')
  */
  return txReceipt.tx
}
