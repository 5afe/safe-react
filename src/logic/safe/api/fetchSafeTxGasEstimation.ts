import { postSafeGasEstimation, SafeTransactionEstimationRequest } from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { GATEWAY_URL } from 'src/utils/constants'

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
} & SafeTransactionEstimationRequest

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<string> => {
  return postSafeGasEstimation(GATEWAY_URL, _getChainId(), checksumAddress(safeAddress), body).then(
    ({ safeTxGas }) => safeTxGas,
  )
}
