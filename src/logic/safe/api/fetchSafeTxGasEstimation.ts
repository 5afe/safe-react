import {
  postSafeGasEstimation,
  SafeTransactionEstimationRequest,
  SafeTransactionEstimation,
  Operation,
} from '@gnosis.pm/safe-react-gateway-sdk'

import { _getChainId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
} & SafeTransactionEstimationRequest

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<SafeTransactionEstimation> => {
  return postSafeGasEstimation(_getChainId(), checksumAddress(safeAddress), body)
}

export const getRecommendedNonce = async (safeAddress: string): Promise<number> => {
  const { recommendedNonce } = await fetchSafeTxGasEstimation({
    safeAddress,
    value: '0',
    operation: Operation.CALL,
    // Workaround: use a cancellation transaction to fetch only the recommendedNonce
    to: safeAddress,
    data: '0x',
  })
  return recommendedNonce
}
