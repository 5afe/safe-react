import { proposeTransaction, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { store } from 'src/store'
import { currentNetworkId, currentSafeServiceBaseUrl } from 'src/logic/config/store/selectors'

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
  const state = store.getState()
  const baseUrl = currentSafeServiceBaseUrl(state, checksumAddress(safeAddress))
  return `${baseUrl}/multisig-transactions/?has_confirmations=True`
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
  const networkId = currentNetworkId(store.getState())
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
  const txDetails = await proposeTransaction(CONFIG_SERVICE_URL, networkId, address, body)
  return txDetails
}
