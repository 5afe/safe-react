import axios, { AxiosResponse } from 'axios'

import { getTokensServiceBaseUrl } from 'src/config'
import { TokenType } from 'src/logic/safe/store/models/types/gateway'

export type TokenResult = {
  address: string
  decimals?: number
  logoUri: string
  name: string
  symbol: string
  type: TokenType
}

export const fetchErc20AndErc721AssetsList = (): Promise<AxiosResponse<{ results: TokenResult[] }>> => {
  const url = getTokensServiceBaseUrl()

  return axios.get<{ results: TokenResult[] }, AxiosResponse<{ results: TokenResult[] }>>(`${url}/`, {
    params: {
      limit: 3000,
    },
  })
}
