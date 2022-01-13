import { getTransactionDetails, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { getGatewayUrl, _getChainId } from 'src/config'

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<TransactionDetails> => {
  return getTransactionDetails(getGatewayUrl(), _getChainId(), clientGatewayTxId)
}
