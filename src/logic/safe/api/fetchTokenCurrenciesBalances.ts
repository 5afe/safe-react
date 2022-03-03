import { request } from 'graphql-request'
import { GatewayDefinitions, TokenType } from '@gnosis.pm/safe-react-gateway-sdk'
import { getNetworkExplorerInfo } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import BigNumber from 'bignumber.js'

export type TokenBalance = {
  tokenInfo: GatewayDefinitions['TokenInfo']
  balance: string
  fiatBalance: string
  fiatConversion: string
}

export type BalanceEndpoint = GatewayDefinitions['SafeBalanceResponse']

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string
  selectedCurrency: string
  excludeSpamTokens?: boolean
  trustedTokens?: boolean
}

export const fetchTokenCurrenciesBalances = async ({
  safeAddress,
  selectedCurrency = 'USD',
  excludeSpamTokens = true,
}: FetchTokenCurrenciesBalancesProps): Promise<BalanceEndpoint> => {
  const address = checksumAddress(safeAddress)

  const items = await toItems(address, selectedCurrency, excludeSpamTokens)

  return {
    fiatTotal: items.reduce((sum, token) => sum + Number(token.fiatBalance), 0).toString(),
    items: items.sort((a, b) => {
      return a.fiatBalance < b.fiatBalance ? 1 : -1
    }),
  }
}
const WEI_PER = 1_000_000_000_000_000_000
const exchangeRate = 1

async function toItems(address: string, selectedCurrency: string, excludeSpamTokens: boolean) {
  const [tokens, prices] = await Promise.all([fetchTokens(address), fetchPrices()])

  const filteredTokens = excludeSpamTokens ? tokens.filter((token) => !/doge/i.test(token.name)) : tokens

  return filteredTokens.map((token) => {
    const usdConversion = token.symbol === 'cUSD' ? 1 : prices[token.symbol.toUpperCase()] || 0
    // TODO when we bring back multi fiat support change exchangeRate to the actual rate
    const fiatConversion = selectedCurrency === 'USD' ? usdConversion : usdConversion * exchangeRate
    return {
      tokenInfo: {
        type: TokenType.ERC20,
        address: token.contractAddress,
        decimals: Number(token.decimals),
        symbol: token.symbol,
        name: token.name,
        logoUri: `https://raw.githubusercontent.com/ubeswap/default-token-list/master/assets/asset_${token.symbol}.png`,
      },
      balance: token.balance,
      fiatBalance: new BigNumber(token.balance).dividedBy(WEI_PER).multipliedBy(fiatConversion).toString(),
      fiatConversion: fiatConversion.toString(),
    }
  })
}
interface BlockscoutTokenBalance {
  balance: string
  contractAddress: string
  decimals: string
  name: string
  symbol: string
  type: string
}

async function fetchTokens(address: string) {
  const blockScoutEndpoint = `${getNetworkExplorerInfo().apiUrl}?module=account&action=tokenlist&address=${address}`
  // retry once if it fails as gonza says that happens sometimes
  const res = await fetch(blockScoutEndpoint).catch((e) => {
    console.warn('Fetch error', e)
    return fetch(blockScoutEndpoint)
  })
  const tokenBalances: BlockscoutTokenBalance[] = (await res.json()).result

  return tokenBalances
}

interface PriceInfo {
  symbol: string
  derivedCUSD: number
}

const tokensQuery = `query { tokens(number_gte: 11749000) {
  derivedCUSD
  symbol
}}`

async function fetchPrices(): Promise<Record<string, number>> {
  const { tokens } = await request<{ tokens: PriceInfo[] }>(
    'https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap',
    tokensQuery,
  )
  return tokens.reduce((collection, entry) => {
    collection[entry.symbol.toUpperCase()] = entry.derivedCUSD
    return collection
  }, {})
}
