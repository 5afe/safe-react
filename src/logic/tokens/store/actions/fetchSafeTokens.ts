import { backOff } from 'exponential-backoff'
import { List, Map } from 'immutable'
import { Dispatch } from 'redux'

import { fetchTokenCurrenciesBalances, TokenBalance } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { addTokens } from 'src/logic/tokens/store/actions/addTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { AppReduxState } from 'src/store'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { safeActiveTokensSelector, safeSelector } from 'src/logic/safe/store/selectors'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import BigNumber from 'bignumber.js'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'

export type BalanceRecord = {
  tokenBalance: string
  fiatBalance?: string
}

interface ExtractedData {
  balances: Map<string, BalanceRecord>
  ethBalance: string
  tokens: List<Token>
}

const extractDataFromResult = (currentTokens: TokenState) => (
  acc: ExtractedData,
  { balance, fiatBalance, tokenInfo }: TokenBalance,
): ExtractedData => {
  const { address, decimals } = tokenInfo

  acc.balances = acc.balances.merge({
    [address]: {
      fiatBalance,
      tokenBalance: humanReadableValue(balance, Number(decimals)),
    },
  })

  // Extract network token balance from backend balances
  if (address === ZERO_ADDRESS) {
    acc.ethBalance = humanReadableValue(balance, Number(decimals))
  }

  if (currentTokens && !currentTokens.get(address)) {
    acc.tokens = acc.tokens.push(makeToken({ ...tokenInfo }))
  }

  return acc
}

export const fetchSafeTokens = (safeAddress: string, currencySelected?: string) => async (
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
    const selectedCurrency = currentCurrencySelector(state)

    const tokenCurrenciesBalances = await backOff(() =>
      fetchTokenCurrenciesBalances({ safeAddress, selectedCurrency: currencySelected ?? selectedCurrency }),
    )
    const alreadyActiveTokens = safeActiveTokensSelector(state)

    const { balances, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
      extractDataFromResult(currentTokens),
      {
        balances: Map(),
        ethBalance: '0',
        tokens: List(),
      },
    )

    // need to persist those already active tokens, despite its balances
    const activeTokens = alreadyActiveTokens.union(balances.keySeq().toSet())

    dispatch(
      updateSafe({
        address: safeAddress,
        activeTokens,
        balances,
        ethBalance,
        totalFiatBalance: new BigNumber(tokenCurrenciesBalances.fiatTotal).toFixed(2),
      }),
    )
    dispatch(addTokens(tokens))
  } catch (err) {
    console.error('Error fetching active token list', err)
  }
}
