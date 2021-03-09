import axios from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { checksumAddress } from 'src/utils/checksumAddress'

export type TokenBalance = {
  tokenInfo: TokenProps
  balance: string
  fiatBalance: string
  fiatConversion: string
}

export type BalanceEndpoint = {
  fiatTotal: string
  items: TokenBalance[]
}

export const fetchTokenCurrenciesBalances = (
  safeAddress: string,
  excludeSpamTokens = true,
  trustedTokens = false,
): Promise<BalanceEndpoint> => {
  const url = `${getSafeClientGatewayBaseUrl(
    checksumAddress(safeAddress),
  )}/balances/usd/?trusted=${trustedTokens}&exclude_spam=${excludeSpamTokens}`

  return axios.get(url).then(({ data }) => data)
}
