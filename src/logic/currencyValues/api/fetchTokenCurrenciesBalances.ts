import axios, { AxiosResponse } from 'axios'

import { getTxServiceHost } from 'src/config'
import { TokenProps } from '../../tokens/store/model/token'

type BalanceEndpoint = {
  balance: string
  balanceUsd: string
  tokenAddress?: string
  token?: TokenProps
  usdConversion: string
}

const fetchTokenCurrenciesBalances = (safeAddress?: string): Promise<AxiosResponse<BalanceEndpoint[]>> => {
  if (!safeAddress) {
    return null
  }
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/usd/`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenCurrenciesBalances
