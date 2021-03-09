import axios, { AxiosResponse } from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export type CollectibleResult = {
  address: string
  description: string | null
  id: string
  imageUri: string | null
  logoUri: string
  metadata: Record<string, unknown>
  name: string | null
  tokenName: string
  tokenSymbol: string
  uri: string | null
}

export const fetchSafeCollectibles = async (safeAddress: string): Promise<AxiosResponse<CollectibleResult[]>> => {
  const url = `${getSafeClientGatewayBaseUrl(checksumAddress(safeAddress))}/collectibles/`
  return axios.get<CollectibleResult[], AxiosResponse<CollectibleResult[]>>(url)
}
