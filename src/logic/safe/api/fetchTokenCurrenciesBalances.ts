import axios from 'axios'
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

  const tokens = await getTokenBalances(address, selectedCurrency, excludeSpamTokens)

  return {
    fiatTotal: tokens.reduce((sum, token) => sum + Number(token.fiatBalance), 0).toString(),
    items: tokens.sort((a, b) => {
      return a.fiatBalance < b.fiatBalance ? 1 : -1
    }),
  }
}
const WEI_PER = 1_000_000_000_000_000_000

async function getTokenBalances(address: string, selectedCurrency: string, excludeSpamTokens: boolean) {
  const tokens = await fetchTokens(address)

  const filteredTokens = excludeSpamTokens ? tokens.filter((token) => !/doge/i.test(token.name)) : tokens
  const tokenPrices = await fetchPrices(filteredTokens, selectedCurrency)

  return filteredTokens.map((token) => {
    const price = tokenPrices[token.contractAddress]?.[selectedCurrency.toLowerCase()] || 0
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
      fiatBalance: new BigNumber(token.balance).dividedBy(WEI_PER).multipliedBy(price).toString(),
      fiatConversion: '1',
    }
  })
}

interface BlockScoutApiResult<T> {
  message: string
  result: T
}
interface BlockScoutTokenBalance {
  balance: string
  contractAddress: string
  decimals: string
  name: string
  symbol: string
  type: string
}

async function fetchTokens(address: string) {
  const tokenBalances = await fetchTokensWithRetriesAndAlternate(address)
  return tokenBalances
}

type TokenAPIResult = BlockScoutApiResult<BlockScoutTokenBalance[]>

async function fetchTokensWithRetriesAndAlternate(address: string) {
  const blockScoutEndpoint = `${getNetworkExplorerInfo().apiUrl}?module=account&action=tokenlist&address=${address}`

  for (let i = 0; i < 3; i++) {
    const results = await Promise.allSettled<[Promise<TokenAPIResult>, Promise<TokenAPIResult>]>([
      fetch(blockScoutEndpoint).then((res) => res.json()),
      fetch(`https://rc1-blockscout.celo-testnet.org/api?module=account&action=tokenlist&address=${address}`).then(
        (res) => res.json(),
      ),
    ])
    const fulfilled = results.find((result) => result.status === 'fulfilled')
    if (fulfilled) {
      const successful = fulfilled as PromiseFulfilledResult<TokenAPIResult>
      return successful.value.result
    } else {
      const rejected = results as PromiseRejectedResult[]
      console.warn('Could not fetch tokens', rejected[0].reason, rejected[1].reason)
    }
  }

  console.error('fetching tokens failed')

  return []
}

type TokenPrices = {
  [key: string]: {
    [currency: string]: number
  }
}

async function fetchPrices(tokens: BlockScoutTokenBalance[], selectedCurrency: string): Promise<TokenPrices> {
  const addressesString = tokens.reduce((addresses, token) => {
    return `${addresses},${token.contractAddress}`
  }, '')
  const priceUrl = `https://api.coingecko.com/api/v3/simple/token_price/celo?vs_currencies=${selectedCurrency}&contract_addresses=${addressesString}`
  try {
    const tokenPrices = await axios.get<TokenPrices>(priceUrl)
    return tokenPrices.data
  } catch (e) {
    console.error('Could not fetch token prices', e)
    return {}
  }
}
