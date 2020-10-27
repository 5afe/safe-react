import axios, { AxiosResponse } from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'

export type BalanceEndpoint = {
  tokenAddress: string
  token?: TokenProps
  balance: string
  fiatBalance: string
  fiatConversion: string
  fiatCode: string
}

export const fetchTokenCurrenciesBalances = (
  safeAddress: string,
  excludeSpamTokens = true,
): Promise<AxiosResponse<BalanceEndpoint[]>> => {
  const url = `${getSafeServiceBaseUrl(safeAddress)}/balances/usd/?exclude_spam=${excludeSpamTokens}`

  return axios.get(url)
}
