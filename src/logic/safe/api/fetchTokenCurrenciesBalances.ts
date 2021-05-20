import axios from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { checksumAddress } from 'src/utils/checksumAddress'

export type TokenBalance = {
  tokenInfo: Omit<TokenProps, 'balance'>
  balance: string
  fiatBalance: string
  fiatConversion: string
}

export type BalanceEndpoint = {
  fiatTotal: string
  items: TokenBalance[]
}

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string
  selectedCurrency: string
  excludeSpamTokens?: boolean
  trustedTokens?: boolean
}

export const fetchTokenCurrenciesBalances = ({
  safeAddress,
  selectedCurrency,
  excludeSpamTokens = true,
  trustedTokens = false,
}: FetchTokenCurrenciesBalancesProps): Promise<BalanceEndpoint> => {
  const url = `${getSafeClientGatewayBaseUrl(
    checksumAddress(safeAddress),
  )}/balances/${selectedCurrency}/?trusted=${trustedTokens}&exclude_spam=${excludeSpamTokens}`

  return axios.get(url).then(({ data }) => data)
}
