// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { getGnosisSafeContract } from '~/wallets/safeContracts'

type Type = 'confirmation' | 'execution'
type Operation = 0 | 1 | 2

const calculateBodyFrom = async (
  safeAddress: string,
  to: string,
  value: number,
  data: string,
  operation: Operation,
  nonce: number,
  transactionHash: string,
  sender: string,
  type: Type,
) => {
  const web3 = getWeb3()
  const valueInWei = value > 0 ? web3.toWei(value, 'ether') : value
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)
  const contractTransactionHash = await gnosisSafe.getTransactionHash(safeAddress, valueInWei, data, operation, nonce)

  return JSON.stringify({
    to,
    value,
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
  value: number,
  data: string,
  operation: Operation,
  nonce: number,
  txHash: string,
  sender: string,
  type: Type,
) => {
  const base = `safes/${safeAddress}/transaction/`
  const url = `https://safe-transaction-history.dev.gnosisdev.com/${base}`
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const body = await calculateBodyFrom(safeAddress, to, value, data, operation, nonce, txHash, sender, type)

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
