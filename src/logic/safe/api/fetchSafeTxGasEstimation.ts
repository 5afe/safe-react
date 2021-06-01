import axios from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export type GasEstimationResponse = {
  safeTxGas: string
}

type FetchSafeTxGasEstimationProps = {
  safeAddress: string
  to: string
  value: string
  data?: string
  operation: number
}

export const fetchSafeTxGasEstimation = ({ safeAddress, ...body }: FetchSafeTxGasEstimationProps): Promise<string> => {
  const url = `${getSafeServiceBaseUrl(checksumAddress(safeAddress))}/multisig-transactions/estimations/`

  return axios.post(url, body).then(({ data }) => data.safeTxGas)
}
