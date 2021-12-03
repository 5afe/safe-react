import { TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import axios, { AxiosResponse } from 'axios'
import { getTokensServiceUrl } from 'src/config'

export type TokenResult = {
  address: string
  decimals?: number
  logoUri: string
  name: string
  symbol: string
  type: TokenType
}

export const fetchErc20AndErc721AssetsList = (): Promise<AxiosResponse<{ results: TokenResult[] }>> => {
  return axios.get<{ results: TokenResult[] }, AxiosResponse<{ results: TokenResult[] }>>(getTokensServiceUrl(), {
    params: {
      limit: 3000,
    },
  })
}
