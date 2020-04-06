// 
import axios from 'axios'

import { getTxServiceHost, getTxServiceUriFrom } from 'src/config'
import { getWeb3 } from 'src/logic/wallets/getWeb3'


const calculateBodyFrom = async (
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
  transactionHash,
  sender,
  origin,
  signature,
) => {
  const contractTransactionHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
  )

  return {
    to: getWeb3().utils.toChecksumAddress(to),
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
    sender: getWeb3().utils.toChecksumAddress(sender),
    origin,
    signature,
  }
}

export const buildTxServiceUrl = (safeAddress) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}${base}`
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
}) => {
  const url = buildTxServiceUrl(safeInstance.address)
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

  if (response.status !== 202) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
