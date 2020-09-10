import axios, { AxiosResponse } from 'axios'

import { getTxServiceHost } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'

export type BalanceEndpoint = {
  balance: string
  balanceUsd: string
  tokenAddress?: string
  token?: TokenProps
  usdConversion: string
}

const fetchTokenCurrenciesBalances = (
  safeAddress?: string,
  excludeSpamTokens = true,
): Promise<AxiosResponse<BalanceEndpoint[]>> => {
  if (!safeAddress) {
    return null
  }
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/usd/?exclude_spam=${excludeSpamTokens}`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}

export default fetchTokenCurrenciesBalances
