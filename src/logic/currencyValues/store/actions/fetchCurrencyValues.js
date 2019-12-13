// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List } from 'immutable'
import type { GlobalState } from '~/store'
import { setCurrencyBalances } from '~/logic/currencyValues/store/actions/setCurrencyBalances'
import { AVAILABLE_CURRENCIES, makeBalanceCurrency } from '~/logic/currencyValues/store/model/currencyValues'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'
import fetchTokenCurrenciesBalances from '~/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import { loadFromStorage } from '~/utils/storage'
import fetchCurrencySelectedValue from '~/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { CURRENCY_SELECTED_KEY } from '~/logic/currencyValues/store/actions/saveCurrencySelected'


export const fetchCurrencyValues = (safeAddress: string) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const tokensFetched = await fetchTokenCurrenciesBalances(safeAddress)

    // eslint-disable-next-line max-len
    const currencyList = List(tokensFetched.data.filter((currencyBalance) => currencyBalance.balanceUsd).map((currencyBalance) => {
      const { balanceUsd, tokenAddress } = currencyBalance
      return makeBalanceCurrency({
        currencyName: balanceUsd ? AVAILABLE_CURRENCIES.USD : null,
        tokenAddress,
        balanceInBaseCurrency: balanceUsd,
        balanceInSelectedCurrency: balanceUsd,
      })
    }))

    dispatch(setCurrencyBalances(currencyList))
    const currencyStored = await loadFromStorage(CURRENCY_SELECTED_KEY)
    if (!currencyStored) {
      return dispatch(setCurrencySelected(AVAILABLE_CURRENCIES.USD))
    }
    const { currencyValueSelected } = currencyStored
    dispatch(fetchCurrencySelectedValue(currencyValueSelected))
    dispatch(setCurrencySelected(currencyValueSelected))
  } catch (err) {
    console.error('Error fetching tokens price list', err)
  }
  return Promise.resolve()
}

export default fetchCurrencyValues
