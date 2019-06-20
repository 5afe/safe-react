// @flow
import axios from 'axios'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getTxServiceUriFrom, getTxServiceHost } from '~/config'
import { ZERO_ADDRESS } from '~/logic/wallets/ethAddresses'

export type TxServiceType = 'confirmation' | 'execution' | 'initialised'
export type Operation = 0 | 1 | 2

const calculateBodyFrom = async (
  safeInstance: any,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: string | number,
  transactionHash: string,
  sender: string,
  confirmationType: TxServiceType,
) => {
  const contractTransactionHash = await safeInstance.getTransactionHash(
    to,
    valueInWei,
    data,
    operation,
    0,
    0,
    0,
    ZERO_ADDRESS,
    ZERO_ADDRESS,
    nonce,
  )

  return {
    to: getWeb3().utils.toChecksumAddress(to),
    value: valueInWei,
    data,
    operation,
    nonce,
    safeTxGas: 0,
    baseGas: 0,
    gasPrice: 0,
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    contractTransactionHash,
    transactionHash,
    sender: getWeb3().utils.toChecksumAddress(sender),
    confirmationType,
  }
}

export const buildTxServiceUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}${base}`
}

export const saveTxToHistory = async (
  safeInstance: any,
  to: string,
  valueInWei: number,
  data: string,
  operation: Operation,
  nonce: number | string,
  txHash: string,
  sender: string,
  type: TxServiceType,
) => {
  const url = buildTxServiceUrl(safeInstance.address)
  const body = await calculateBodyFrom(safeInstance, to, valueInWei, data, operation, nonce, txHash, sender, type)
  const response = await axios.post(url, body)

  if (response.status !== 202) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
