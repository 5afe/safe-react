import { getTransactionDetails, TransactionDetails } from '@gnosis.pm/safe-react-gateway-sdk'

import { getClientGatewayUrl, getNetworkId } from 'src/config'

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<TransactionDetails> => {
  return getTransactionDetails(getClientGatewayUrl(), getNetworkId().toString(), clientGatewayTxId)
}
