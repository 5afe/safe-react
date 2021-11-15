import { TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import axios, { AxiosResponse } from 'axios'

import { currentTokensServiceBaseUrl } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

export type TokenResult = {
  address: string
  decimals?: number
  logoUri: string
  name: string
  symbol: string
  type: TokenType
}

export const fetchErc20AndErc721AssetsList = (): Promise<AxiosResponse<{ results: TokenResult[] }>> => {
  const url = currentTokensServiceBaseUrl(store.getState())

  return axios.get<{ results: TokenResult[] }, AxiosResponse<{ results: TokenResult[] }>>(`${url}/`, {
    params: {
      limit: 3000,
    },
  })
}
