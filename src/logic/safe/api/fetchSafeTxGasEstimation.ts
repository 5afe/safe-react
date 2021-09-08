import { postSafeGasEstimation, SafeTransactionEstimationRequest } from '@gnosis.pm/safe-react-gateway-sdk'

import { getClientGatewayUrl, getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
} & SafeTransactionEstimationRequest

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<string> => {
  return postSafeGasEstimation(
    getClientGatewayUrl(),
    getNetworkId().toString(),
    checksumAddress(safeAddress),
    body,
  ).then(({ safeTxGas }) => safeTxGas)
}
