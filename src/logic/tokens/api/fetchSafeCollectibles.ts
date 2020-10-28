import axios, { AxiosResponse } from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
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
  const address = checksumAddress(safeAddress)
  const url = `${getSafeServiceBaseUrl(address)}/collectibles/`

  return axios.get(url)
}
