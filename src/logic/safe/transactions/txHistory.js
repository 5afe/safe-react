// @flow
import axios from 'axios'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { getTxServiceUriFrom, getTxServiceHost } from '~/config'

export type TxServiceType = 'confirmation' | 'execution' | 'initialised'
export type Operation = 0 | 1 | 2

const calculateBodyFrom = async (
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: string | number,
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  transactionHash: string,
  sender: string,
  confirmationType: TxServiceType,
  origin: string | null,
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
    confirmationType,
    origin,
  }
}

export const buildTxServiceUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = getWeb3().utils.toChecksumAddress(safeAddress)
  const base = getTxServiceUriFrom(address)
  return `${host}${base}`
}

export const saveTxToHistory = async ({
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
  txHash,
  sender,
  type,
  origin,
}: {
  safeInstance: any,
  to: string,
  valueInWei: number | string,
  data: string,
  operation: Operation,
  nonce: number | string,
  safeTxGas: string | number,
  baseGas: string | number,
  gasPrice: string | number,
  gasToken: string,
  refundReceiver: string,
  txHash: string,
  sender: string,
  type: TxServiceType,
  origin: string | null,
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
    txHash,
    sender,
    type,
    origin || null,
  )
  const response = await axios.post(url, body)

  if (response.status !== 202) {
    return Promise.reject(new Error('Error submitting the transaction'))
  }

  return Promise.resolve()
}
