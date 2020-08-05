import { List, Map } from 'immutable'
import { backOff } from 'exponential-backoff'
import { batch } from 'react-redux'
import { Dispatch } from 'redux'

import fetchTokenCurrenciesBalances, {
  BalanceEndpoint,
} from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import {
  AVAILABLE_CURRENCIES,
  CurrencyRateValueRecord,
  makeBalanceCurrency,
} from 'src/logic/currencyValues/store/model/currencyValues'
import addTokens from 'src/logic/tokens/store/actions/saveTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { TokenState } from 'src/logic/tokens/store/reducer/tokens'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { AppReduxState } from 'src/store'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { SafeRecordProps } from 'src/routes/safe/store/models/safe'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'
import { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import { CURRENCY_VALUES_KEY } from 'src/logic/currencyValues/store/reducer/currencyValues'

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
  { balance, balanceUsd, token, tokenAddress }: BalanceEndpoint,
): ExtractedData => {
  if (tokenAddress === null) {
    acc.ethBalance = humanReadableValue(balance, 18)
  } else {
    acc.balances = acc.balances.merge({ [tokenAddress]: humanReadableValue(balance, Number(token.decimals)) })

    if (currentTokens && !currentTokens.get(tokenAddress)) {
      acc.tokens = acc.tokens.push(makeToken({ address: tokenAddress, ...token }))
    }
  }

  acc.currencyList = acc.currencyList.push(
    makeBalanceCurrency({
      currencyName: balanceUsd ? AVAILABLE_CURRENCIES.USD : null,
      tokenAddress,
      balanceInBaseCurrency: balanceUsd,
      balanceInSelectedCurrency: balanceUsd,
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
    const safe = state[SAFE_REDUCER_ID].getIn(['safes', safeAddress])
    const currentTokens = state[TOKEN_REDUCER_ID]

    if (!safe) {
      return
    }

    const result = await backOff(() => fetchTokenCurrenciesBalances(safeAddress))
    const currentEthBalance = safe.get('ethBalance')
    const safeBalances = safe.get('balances')
    const alreadyActiveTokens = safe.get('activeTokens')
    const blacklistedTokens = safe.get('blacklistedTokens')
    const currencyValues = state[CURRENCY_VALUES_KEY]

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
