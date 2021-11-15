import { getTransactionDetails, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'
import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

import { CONFIG_SERVICE_URL } from 'src/utils/constants'

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<TransactionDetails> => {
  const state = store.getState()
  return getTransactionDetails(CONFIG_SERVICE_URL, currentNetworkId(state), clientGatewayTxId)
}
