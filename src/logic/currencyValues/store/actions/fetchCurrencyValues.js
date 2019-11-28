// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List } from 'immutable'
import type { GlobalState } from '~/store'
import { setCurrencyBalances } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { AVAILABLE_CURRENCIES, makeBalanceCurrency } from '~/logic/currencyValues/store/model/currencyValues'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import fetchTokenCurrenciesBalances from '~/logic/currencyValues/api/fetchTokenCurrenciesBalances'


export const fetchCurrencyValues = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const tokensFetched = await fetchTokenCurrenciesBalances(safeAddress)

    // eslint-disable-next-line max-len
    const currencyList = List(tokensFetched.data.filter((currencyBalance) => currencyBalance.balanceUSD).map((currencyBalance) => {
      const { balanceUSD, tokenAddress } = currencyBalance
      return makeBalanceCurrency({
        currencyName: balanceUSD ? AVAILABLE_CURRENCIES.USD : null,
        tokenAddress,
        balanceInCurrency: balanceUSD,
      })
    }))

    dispatch(setCurrencyBalances(currencyList))
    dispatch(setCurrencySelected(AVAILABLE_CURRENCIES.USD))
  } catch (err) {
    console.error('Error fetching tokens price list', err)
  }
  return Promise.resolve()
}

export default fetchCurrencyValues
