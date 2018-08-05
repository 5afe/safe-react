// @flow
import { getSafeEthereumInstance } from '~/wallets/createTransactions'

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
  const contractTransactionHash = await gnosisSafe.getTransactionHash(safeAddress, valueInWei, data, operation, nonce)

  return JSON.stringify({
    to,
    value: Number(valueInWei),
    data,
    operation,
    nonce,
    contractTransactionHash,
    transactionHash,
    sender,
    type,
  })
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
  const base = `safes/${safeAddress}/transaction/`
  const url = `https://safe-transaction-history.dev.gnosisdev.com/api/v1/${base}`
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const body = await calculateBodyFrom(safeAddress, to, valueInWei, data, operation, nonce, txHash, sender, type)

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  if (response.status !== 201) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
