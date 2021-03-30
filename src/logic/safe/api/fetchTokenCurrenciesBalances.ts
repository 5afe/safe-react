import axios from 'axios'

import { getSafeClientGatewayBaseUrl, getNetworkInfo } from 'src/config'
import { TokenProps } from 'src/logic/tokens/store/model/token'
import { checksumAddress } from 'src/utils/checksumAddress'

import { ZERO_ADDRESS, sameAddress } from 'src/logic/wallets/ethAddresses'

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
}: FetchTokenCurrenciesBalancesProps): Promise<BalanceEndpoint> => {
  const url = `${getSafeClientGatewayBaseUrl(
    checksumAddress(safeAddress),
  )}/balances/${selectedCurrency}/?trusted=${trustedTokens}&exclude_spam=${excludeSpamTokens}`

  return axios.get(url).then(({ data }) => {
    // Currently the client-gateway is not returning the balance using network token symbol and name
    // FIXME remove this logic and return data directly once this is fixed
    const { nativeCoin } = getNetworkInfo()

    if (data.items && data.items.length) {
      data.items = data.items.map((element) => {
        const { tokenInfo } = element
        if (sameAddress(ZERO_ADDRESS, tokenInfo.address)) {
          // If it's native coin we swap symbol and name
          tokenInfo.symbol = nativeCoin.symbol
          tokenInfo.name = nativeCoin.name
        }

        return element
      })
    }

    return data
  })
}
