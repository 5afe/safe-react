import { backOff } from 'exponential-backoff'
import { List, Map } from 'immutable'
import { Dispatch } from 'redux'

import { fetchTokenCurrenciesBalances, TokenBalance } from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'

import {
  AVAILABLE_CURRENCIES,
  CurrencyRateValueRecord,
  makeBalanceCurrency,
} from 'src/logic/currencyValues/store/model/currencyValues'
import addTokens from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { AppReduxState } from 'src/store'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { safeActiveTokensSelector, safeBlacklistedTokensSelector, safeSelector } from 'src/logic/safe/store/selectors'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { getNetworkInfo } from 'src/config'

interface ExtractedData {
  balances: Map<string, string>
  currencyList: List<CurrencyRateValueRecord>
  ethBalance: string
  tokens: List<Token>
}

const { nativeCoin } = getNetworkInfo()

const extractDataFromResult = (currentTokens: TokenState, fiatCode: string) => (
  acc: ExtractedData,
  { balance, fiatBalance, tokenInfo }: TokenBalance,
): ExtractedData => {
  const { address: tokenAddress, decimals } = tokenInfo
  if (sameAddress(tokenAddress, ZERO_ADDRESS) || sameAddress(tokenAddress, nativeCoin.address)) {
    acc.ethBalance = humanReadableValue(balance, 18)
  } else {
    acc.balances = acc.balances.merge({ [tokenAddress]: humanReadableValue(balance, Number(decimals)) })

    if (currentTokens && !currentTokens.get(tokenAddress)) {
      acc.tokens = acc.tokens.push(makeToken({ ...tokenInfo }))
    }
  }

  acc.currencyList = acc.currencyList.push(
    makeBalanceCurrency({
      currencyName: fiatCode,
      tokenAddress,
      balanceInBaseCurrency: fiatBalance,
      balanceInSelectedCurrency: fiatBalance,
    }),
  )

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
    const currencySelected = currentCurrencySelector(state)

    if (!safe) {
      return
    }

    const tokenCurrenciesBalances = await backOff(() => fetchTokenCurrenciesBalances(safeAddress))
    const alreadyActiveTokens = safeActiveTokensSelector(state)
    const blacklistedTokens = safeBlacklistedTokensSelector(state)

    const { balances, currencyList, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
      extractDataFromResult(currentTokens, currencySelected || AVAILABLE_CURRENCIES.USD),
      {
        balances: Map(),
        currencyList: List(),
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
    dispatch(setCurrencyBalances(safeAddress, currencyList))
    dispatch(addTokens(tokens))
  } catch (err) {
    console.error('Error fetching active token list', err)
  }
}
