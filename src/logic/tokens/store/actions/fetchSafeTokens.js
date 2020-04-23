// @flow
import { BigNumber } from 'bignumber.js'
import { List, Map } from 'immutable'
import { batch } from 'react-redux'
import type { Dispatch as ReduxDispatch } from 'redux'

import fetchTokenCurrenciesBalances from '~/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import { setCurrencyBalances } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { AVAILABLE_CURRENCIES, makeBalanceCurrency } from '~/logic/currencyValues/store/model/currencyValues'
import { CURRENCY_VALUES_KEY } from '~/logic/currencyValues/store/reducer/currencyValues'
import addTokens from '~/logic/tokens/store/actions/saveTokens'
import { makeToken } from '~/logic/tokens/store/model/token'
import { TOKEN_REDUCER_ID } from '~/logic/tokens/store/reducer/tokens'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { type GetState, type GlobalState } from '~/store'

const humanReadableBalance = (balance, decimals) => BigNumber(balance).times(`1e-${decimals}`).toFixed()
const noFunc = () => {}
const updateSafeValue = (address) => (valueToUpdate) => updateSafe({ address, ...valueToUpdate })

const fetchSafeTokens = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState) => {
  try {
    const state = getState()
    const safe = state[SAFE_REDUCER_ID].getIn([SAFE_REDUCER_ID, safeAddress])
    const currentTokens = state[TOKEN_REDUCER_ID]

    if (!safe) {
      return
    }

    const result = await fetchTokenCurrenciesBalances(safeAddress)
    const currentEthBalance = safe.get('ethBalance')
    const safeBalances = safe.get('balances')
    const alreadyActiveTokens = safe.get('activeTokens')
    const blacklistedTokens = safe.get('blacklistedTokens')
    const currencyValues = state[CURRENCY_VALUES_KEY]
    const storedCurrencyBalances = currencyValues.get('currencyBalances')

    const { balances, currencyList, ethBalance, tokens } = result.data.reduce(
      (acc, { balance, balanceUsd, token, tokenAddress }) => {
        if (tokenAddress === null) {
          acc.ethBalance = humanReadableBalance(balance, 18)
        } else {
          acc.balances = acc.balances.merge({ [tokenAddress]: humanReadableBalance(balance, token.decimals) })

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
      },
      {
        balances: Map(),
        currencyList: List(),
        ethBalance: '0',
        tokens: List(),
      },
    )

    // need to persist those already active tokens, despite its balances
    const activeTokens = alreadyActiveTokens.toSet().union(
      // active tokens by balance, excluding those already blacklisted and the `null` address
      balances.keySeq().toSet().subtract(blacklistedTokens),
    )

    const update = updateSafeValue(safeAddress)
    const updateActiveTokens = activeTokens.equals(alreadyActiveTokens) ? noFunc : update({ activeTokens })
    const updateBalances = balances.equals(safeBalances) ? noFunc : update({ balances })
    const updateEthBalance = ethBalance === currentEthBalance ? noFunc : update({ ethBalance })

    const updateCurrencies = currencyList.equals(storedCurrencyBalances) ? noFunc : setCurrencyBalances(currencyList)

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

  return null
}

export default fetchSafeTokens
