import { backOff } from 'exponential-backoff'
import { List, Map } from 'immutable'
import { Dispatch } from 'redux'

import { fetchTokenCurrenciesBalances, TokenBalance } from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import addTokens from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { AppReduxState } from 'src/store'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { safeActiveTokensSelector, safeBlacklistedTokensSelector, safeSelector } from 'src/logic/safe/store/selectors'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getNetworkInfo } from 'src/config'

export type BalanceRecord = {
  tokenBalance: string
  fiatBalance?: string
}

interface ExtractedData {
  balances: Map<string, BalanceRecord>
  ethBalance: string
  tokens: List<Token>
}

const { nativeCoin } = getNetworkInfo()

const extractDataFromResult = (currentTokens: TokenState) => (
  acc: ExtractedData,
  { balance, fiatBalance, tokenInfo }: TokenBalance,
): ExtractedData => {
  const { address: tokenAddress, decimals } = tokenInfo
  if (sameAddress(tokenAddress, ZERO_ADDRESS) || sameAddress(tokenAddress, nativeCoin.address)) {
    acc.ethBalance = humanReadableValue(balance, 18)
  } else {
    acc.balances = acc.balances.merge({
      [tokenAddress]: {
        fiatBalance,
        tokenBalance: humanReadableValue(balance, Number(decimals)),
      },
    })

    if (currentTokens && !currentTokens.get(tokenAddress)) {
      acc.tokens = acc.tokens.push(makeToken({ ...tokenInfo }))
    }
  }

  return acc
}

export const fetchSafeTokens = (safeAddress: string) => async (
  dispatch: Dispatch,
  getState: () => AppReduxState,
): Promise<void> => {
  try {
    const state = getState()
    const safe = safeSelector(state)
    const currentTokens = tokensSelector(state)

    if (!safe) {
      return
    }

    const tokenCurrenciesBalances = await backOff(() => fetchTokenCurrenciesBalances(safeAddress))
    const alreadyActiveTokens = safeActiveTokensSelector(state)
    const blacklistedTokens = safeBlacklistedTokensSelector(state)

    const { balances, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
      extractDataFromResult(currentTokens),
      {
        balances: Map(),
        ethBalance: '0',
        tokens: List(),
      },
    )

    // need to persist those already active tokens, despite its balances
    const activeTokens = alreadyActiveTokens.union(
      // active tokens by balance, excluding those already blacklisted and the `null` address
      balances.keySeq().toSet().subtract(blacklistedTokens),
    )

    dispatch(updateSafe({ address: safeAddress, activeTokens, balances, ethBalance }))
    dispatch(addTokens(tokens))
  } catch (err) {
    console.error('Error fetching active token list', err)
  }
}
