import { getBalances, SafeBalanceResponse, TokenInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { currentNetworkId } from 'src/logic/config/store/selectors'
import { store } from 'src/store'

import { checksumAddress } from 'src/utils/checksumAddress'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export type TokenBalance = {
  tokenInfo: TokenInfo
  balance: string
  fiatBalance: string
  fiatConversion: string
}

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string
  selectedCurrency: string
  excludeSpamTokens?: boolean
  trustedTokens?: boolean
}

export const fetchTokenCurrenciesBalances = async ({
  safeAddress,
  selectedCurrency,
  excludeSpamTokens = true,
  trustedTokens = false,
}: FetchTokenCurrenciesBalancesProps): Promise<SafeBalanceResponse> => {
  const networkId = currentNetworkId(store.getState())
  const address = checksumAddress(safeAddress)
  return getBalances(CONFIG_SERVICE_URL, networkId, address, selectedCurrency, {
    exclude_spam: excludeSpamTokens,
    trusted: trustedTokens,
  })
}
