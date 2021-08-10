import { getTransactionDetails, GatewayDefinitions } from '@gnosis.pm/safe-react-gateway-sdk'

import { getClientGatewayUrl, getNetworkId } from 'src/config'

export type TransactionDetailsEndpoint = GatewayDefinitions['TransactionDetails']

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<TransactionDetailsEndpoint> => {
  return getTransactionDetails(getClientGatewayUrl(), getNetworkId().toString(), clientGatewayTxId)
}
