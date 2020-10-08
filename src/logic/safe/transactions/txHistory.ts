import axios from 'axios'

import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { getTxServiceUrl, getTxServiceUriFrom } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

const calculateBodyFrom = async (
  safeInstance: GnosisSafe,
  to,
  valueInWei,
  data,
  operation,
  nonce,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver,
  transactionHash,
  sender,
  origin,
  signature,
) => {
  const contractTransactionHash = await safeInstance.methods
    .getTransactionHash(to, valueInWei, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce)
    .call()

  return {
    to: checksumAddress(to),
    value: valueInWei,
    data,
    operation,
    nonce,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    contractTransactionHash,
    transactionHash,
    sender: checksumAddress(sender),
    origin,
    signature,
  }
}

export const buildTxServiceUrl = (safeAddress: string): string => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}/${base}?has_confirmations=True`
}

const SUCCESS_STATUS = 201 // CREATED status

interface SaveTxToHistoryArgs {
  safeInstance: GnosisSafe
  [key: string]: any
}

export const saveTxToHistory = async ({
  baseGas,
  data,
  gasPrice,
  gasToken,
  nonce,
  operation,
  origin,
  refundReceiver,
  safeInstance,
  safeTxGas,
  sender,
  signature,
  to,
  txHash,
  valueInWei,
}: SaveTxToHistoryArgs): Promise<void> => {
  const url = buildTxServiceUrl(safeInstance.options.address)
  const body = await calculateBodyFrom(
    safeInstance,
    to,
    valueInWei,
    data,
    operation,
    nonce,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    txHash || null,
    sender,
    origin || null,
    signature,
  )
  const response = await axios.post(url, body)

  if (response.status !== SUCCESS_STATUS) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
