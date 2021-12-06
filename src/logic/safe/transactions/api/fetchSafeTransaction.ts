import { getTransactionDetails, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { GATEWAY_URL } from 'src/utils/constants'

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<TransactionDetails> => {
  return getTransactionDetails(GATEWAY_URL, _getChainId(), clientGatewayTxId)
}
