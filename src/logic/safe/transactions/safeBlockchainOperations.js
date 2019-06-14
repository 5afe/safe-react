// @flow
import { List } from 'immutable'
import { calculateGasOf, checkReceiptStatus, calculateGasPrice } from '~/logic/wallets/ethTransactions'
import { type Operation, saveTxToHistory } from '~/logic/safe/transactions'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { buildSignaturesFrom } from '~/logic/safe/safeTxSigner'
import { generateMetamaskSignature, generateTxGasEstimateFrom, estimateDataGas } from '~/logic/safe/transactions'
import { storeSignature, getSignaturesFrom } from '~/utils/storage/signatures'
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
    // return executeTransaction(safeAddress, to, valueInWei, data, operation, nonce, sender)
    const safe = await getGnosisSafeInstanceAt(safeAddress)
    const txGasEstimate = await generateTxGasEstimateFrom(safe, safeAddress, data, to, valueInWei, operation)
    const signature = await generateMetamaskSignature(
      safe,
      safeAddress,
      sender,
      to,
      valueInWei,
      nonce,
      data,
      operation,
      txGasEstimate,
    )
    storeSignature(safeAddress, nonce, signature)

    return undefined
  }

  const gnosisSafe = await getGnosisSafeInstanceAt(safeAddress)
  const contractTxHash = await gnosisSafe.getTransactionHash(to, valueInWei, data, operation, 0, 0, 0, 0, 0, nonce)

  const approveData = gnosisSafe.contract.methods.approveHash(contractTxHash).encodeABI()
  const gas = await calculateGasOf(approveData, sender, safeAddress)
  const txReceipt = await gnosisSafe.approveHash(contractTxHash, { from: sender, gas, gasPrice })

  const txHash = txReceipt.tx
  await checkReceiptStatus(txHash)

  await saveTxToHistory(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'confirmation')

  return txHash
}

// export const executeTransaction = async (
//   safeAddress: string,
//   to: string,
//   valueInWei: number,
//   data: string,
//   operation: Operation,
//   nonce: number,
//   sender: string,
//   ownersWhoHasSigned: List<string>,
// ) => {
//   const gasPrice = await calculateGasPrice()

//   if (signaturesViaMetamask()) {
//     const safe = await getSafeEthereumInstance(safeAddress)
//     const txGasEstimate = await generateTxGasEstimateFrom(safe, safeAddress, data, to, valueInWei, operation)
//     const signature = await generateMetamaskSignature(
//       safe,
//       safeAddress,
//       sender,
//       to,
//       valueInWei,
//       nonce,
//       data,
//       operation,
//       txGasEstimate,
//     )
//     storeSignature(safeAddress, nonce, signature)

//     const sigs = getSignaturesFrom(safeAddress, nonce)
//     const threshold = await safe.getThreshold()
//     const gas = await estimateDataGas(
//       safe,
//       to,
//       valueInWei,
//       data,
//       operation,
//       txGasEstimate,
//       0,
//       nonce,
//       Number(threshold),
//       0,
//     )
//     const numOwners = await safe.getOwners()
//     const gasIncludingRemovingStoreUpfront = gas + txGasEstimate + numOwners.length * 15000

//     const txReceipt = await safe.execTransaction(
//       to,
//       valueInWei,
//       data,
//       operation,
//       txGasEstimate,
//       0, // dataGasEstimate
//       0, // gasPrice
//       0, // txGasToken
//       0, // refundReceiver
//       sigs,
//       { from: sender, gas: gasIncludingRemovingStoreUpfront, gasPrice },
//     )

//     const txHash = txReceipt.tx
//     await checkReceiptStatus(txHash)
//     // await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'execution')

//     return txHash
//   }

//   const gnosisSafe = await getSafeEthereumInstance(safeAddress)
//   const signatures = buildSignaturesFrom(ownersWhoHasSigned, sender)
//   const txExecutionData = gnosisSafe.contract.methods
//     .execTransaction(to, valueInWei, data, operation, 0, 0, 0, 0, 0, signatures)
//     .encodeABI()
//   const gas = await calculateGasOf(txExecutionData, sender, safeAddress)
//   const numOwners = await gnosisSafe.getOwners()
//   const gasIncludingRemovingStoreUpfront = gas + numOwners.length * 15000
//   const txReceipt = await gnosisSafe.execTransaction(to, valueInWei, data, operation, 0, 0, 0, 0, 0, signatures, {
//     from: sender,
//     gas: gasIncludingRemovingStoreUpfront,
//     gasPrice,
//   })
//   const txHash = txReceipt.tx
//   await checkReceiptStatus(txHash)

//   await submitOperation(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, 'execution')

//   return txHash
// }
