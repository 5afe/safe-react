import { postSafeGasEstimation, SafeTransactionEstimationRequest } from '@gnosis.pm/safe-react-gateway-sdk'
import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
} & SafeTransactionEstimationRequest

export const fetchSafeTxGasEstimation = async ({
  safeAddress,
  ...body
}: FetchSafeTxGasEstimationProps): Promise<string> => {
  const networkId = currentNetworkId(store.getState())
  return postSafeGasEstimation(CONFIG_SERVICE_URL, networkId, checksumAddress(safeAddress), body).then(
    ({ safeTxGas }) => safeTxGas,
  )
}
