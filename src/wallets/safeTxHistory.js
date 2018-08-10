// @flow
import { getSafeEthereumInstance } from '~/wallets/createTransactions'
import { getWeb3 } from '~/wallets/getWeb3'
import { getTxServiceUriFrom, getTxServiceHost } from '~/config'

type Type = 'confirmation' | 'execution'
export type Operation = 0 | 1 | 2

const calculateBodyFrom = async (
  safeAddress: string,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: number,
  transactionHash: string,
  sender: string,
  type: Type,
) => {
  const gnosisSafe = await getSafeEthereumInstance(safeAddress)
  const contractTransactionHash = await gnosisSafe.getTransactionHash(to, valueInWei, data, operation, nonce)

  return JSON.stringify({
    to: getWeb3().toChecksumAddress(to),
    value: valueInWei,
    data,
    operation,
    nonce,
    contractTransactionHash,
    transactionHash,
    sender: getWeb3().toChecksumAddress(sender),
    type,
  })
}
const buildTxServiceUrlFrom = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = getWeb3().toChecksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}${base}`
}

export const submitOperation = async (
  safeAddress: string,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: number,
  txHash: string,
  sender: string,
  type: Type,
) => {
  const url = buildTxServiceUrlFrom(safeAddress)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
  const body = await calculateBodyFrom(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, type)

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  if (response.status !== 202) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
