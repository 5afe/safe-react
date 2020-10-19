import axios, { AxiosResponse } from 'axios'

import { getTxServiceUrl } from 'src/config'

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
  const apiUrl = getTxServiceUrl()

  const url = `${apiUrl}/safes/${safeAddress}/collectibles/`

  return axios.get(url)
}
