import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { getClientGatewayUrl, getNetworkId, getSafeServiceBaseUrl } from 'src/config'

import { checksumAddress } from 'src/utils/checksumAddress'
import { proposeTransaction, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

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
}: SaveTxToHistoryArgs): Promise<TransactionDetails> => {
  const address = checksumAddress(safeInstance.options.address)
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
  const txDetails = await proposeTransaction(getClientGatewayUrl(), getNetworkId().toString(), address, body)
  return txDetails
}
