import axios from 'axios'

import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { getClientGatewayUrl, getSafeServiceBaseUrl } from 'src/config'
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
  sender,
  origin,
  signature,
) => {
  const safeTxHash = await safeInstance.methods
    .getTransactionHash(to, valueInWei, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce)
    .call()

  return {
    to: checksumAddress(to),
    value: valueInWei,
    data,
    operation,
    nonce: nonce.toString(),
    safeTxGas: safeTxGas.toString(),
    baseGas: baseGas.toString(),
    gasPrice,
    gasToken,
    refundReceiver,
    safeTxHash,
    sender: checksumAddress(sender),
    origin,
    signature,
  }
}

export const buildTxServiceUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/multisig-transactions/?has_confirmations=True`
}

export const gatewayPostTransactionUrl = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getClientGatewayUrl()}/transactions/${address}/propose`
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
  valueInWei,
}: SaveTxToHistoryArgs): Promise<void> => {
  const url = gatewayPostTransactionUrl(safeInstance.options.address)
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
