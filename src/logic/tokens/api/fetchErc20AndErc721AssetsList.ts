import axios, { AxiosResponse } from 'axios'

import { getTxServiceUrl } from 'src/config'

export type TokenResult = {
  address: string
  decimals?: number
  logoUri: string
  name: string
  symbol: string
  type: string
}

export const fetchErc20AndErc721AssetsList = async (): Promise<AxiosResponse<{ results: TokenResult[] }>> => {
  const apiUrl = getTxServiceUrl()

  const url = `${apiUrl}/tokens/`

  return axios.get<{ results: TokenResult[] }>(url, {
    params: {
      limit: 3000,
    },
  })
}
