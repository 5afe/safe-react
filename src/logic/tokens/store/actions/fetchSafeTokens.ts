import { backOff } from 'exponential-backoff'
import { List, Map } from 'immutable'
import { batch } from 'react-redux'
import { Dispatch } from 'redux'

import {
  fetchTokenCurrenciesBalances,
  BalanceEndpoint,
} from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { CurrencyRateValueRecord, makeBalanceCurrency } from 'src/logic/currencyValues/store/model/currencyValues'
import addTokens from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { AppReduxState } from 'src/store'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import {
  safeActiveTokensSelector,
  safeBalancesSelector,
  safeBlacklistedTokensSelector,
  safeEthBalanceSelector,
  safeSelector,
} from 'src/logic/safe/store/selectors'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { currencyValuesSelector } from 'src/logic/currencyValues/store/selectors'

const noFunc = (): void => {}

const updateSafeValue = (address: string) => (valueToUpdate: Partial<SafeRecordProps>) =>
  updateSafe({ address, ...valueToUpdate })

interface ExtractedData {
  balances: Map<string, string>
  currencyList: List<CurrencyRateValueRecord>
  ethBalance: string
  tokens: List<Token>
}

const extractDataFromResult = (currentTokens: TokenState) => (
  acc: ExtractedData,
  { balance, fiatBalance, fiatCode, token, tokenAddress }: BalanceEndpoint,
): ExtractedData => {
  if (tokenAddress === null) {
    acc.ethBalance = humanReadableValue(balance, 18)
  } else {
    acc.balances = acc.balances.merge({ [tokenAddress]: humanReadableValue(balance, Number(token?.decimals)) })

    if (currentTokens && !currentTokens.get(tokenAddress)) {
      acc.tokens = acc.tokens.push(makeToken({ address: tokenAddress, ...token }))
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

const fetchSafeTokens = (safeAddress: string) => async (
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

    const result = await backOff(() => fetchTokenCurrenciesBalances(safeAddress))
    const currentEthBalance = safeEthBalanceSelector(state)
    const safeBalances = safeBalancesSelector(state)
    const alreadyActiveTokens = safeActiveTokensSelector(state)
    const blacklistedTokens = safeBlacklistedTokensSelector(state)
    const currencyValues = currencyValuesSelector(state)

    const { balances, currencyList, ethBalance, tokens } = result.data.reduce<ExtractedData>(
      extractDataFromResult(currentTokens),
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

    const update = updateSafeValue(safeAddress)
    const updateActiveTokens = activeTokens.equals(alreadyActiveTokens) ? noFunc : update({ activeTokens })
    const updateBalances = balances.equals(safeBalances) ? noFunc : update({ balances })
    const updateEthBalance = ethBalance === currentEthBalance ? noFunc : update({ ethBalance })
    const storedCurrencyBalances = currencyValues?.get(safeAddress)?.get('currencyBalances')

    const updateCurrencies = currencyList.equals(storedCurrencyBalances)
      ? noFunc
      : setCurrencyBalances(safeAddress, currencyList)

    const updateTokens = tokens.size === 0 ? noFunc : addTokens(tokens)

    batch(() => {
      dispatch(updateActiveTokens)
      dispatch(updateBalances)
      dispatch(updateEthBalance)
      dispatch(updateCurrencies)
      dispatch(updateTokens)
    })
  } catch (err) {
    console.error('Error fetching active token list', err)
  }
}

export default fetchSafeTokens
