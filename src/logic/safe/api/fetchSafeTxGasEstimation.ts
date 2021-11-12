import { postSafeGasEstimation, SafeTransactionEstimationRequest } from '@gnosis.pm/safe-react-gateway-sdk'

import { getNetworkId } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
} & SafeTransactionEstimationRequest

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<string> => {
  return postSafeGasEstimation(CONFIG_SERVICE_URL, getNetworkId(), checksumAddress(safeAddress), body).then(
    ({ safeTxGas }) => safeTxGas,
  )
}
