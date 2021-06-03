import axios from 'axios'
import { ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'

import { getTxDetailsUrl } from 'src/config'

/**
 * @param {string} clientGatewayTxId safeTxHash or transaction id from client-gateway
 */
export const fetchSafeTransaction = async (clientGatewayTxId: string): Promise<ExpandedTxDetails> => {
  const url = getTxDetailsUrl(clientGatewayTxId)

  return axios.get<ExpandedTxDetails>(url).then(({ data }) => data)
}
