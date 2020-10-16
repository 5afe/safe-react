import axios, { AxiosResponse } from 'axios'

import { getTxServiceHost } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { AVAILABLE_CURRENCIES } from '../store/model/currencyValues'

export type BalanceEndpoint = {
  tokenAddress: string
  token?: TokenProps
  balance: string
  fiatBalance: string
  fiatConversion: string
  fiatCode: AVAILABLE_CURRENCIES
}

export const fetchTokenCurrenciesBalances = (
  safeAddress: string,
  excludeSpamTokens = true,
): Promise<AxiosResponse<BalanceEndpoint[]>> => {
  const apiUrl = getTxServiceHost()
  const url = `${apiUrl}safes/${safeAddress}/balances/usd/?exclude_spam=${excludeSpamTokens}`

  return axios.get(url, {
    params: {
      limit: 3000,
    },
  })
}
