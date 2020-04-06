// 
import { List } from 'immutable'

import fetchTokenCurrenciesBalances from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import fetchCurrencySelectedValue from 'src/logic/currencyValues/store/actions/fetchCurrencySelectedValue'
import { CURRENCY_SELECTED_KEY } from 'src/logic/currencyValues/store/actions/saveCurrencySelected'
import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencySelected } from 'src/logic/currencyValues/store/actions/setCurrencySelected'
import { AVAILABLE_CURRENCIES, makeBalanceCurrency } from 'src/logic/currencyValues/store/model/currencyValues'
import { loadFromStorage } from 'src/utils/storage'

export const fetchCurrencyValues = (safeAddress) => async (dispatch) => {
  try {
    const tokensFetched = await fetchTokenCurrenciesBalances(safeAddress)

    // eslint-disable-next-line max-len
    const currencyList = List(
      tokensFetched.data
        .filter((currencyBalance) => currencyBalance.balanceUsd)
        .map((currencyBalance) => {
          const { balanceUsd, tokenAddress } = currencyBalance
          return makeBalanceCurrency({
            currencyName: balanceUsd ? AVAILABLE_CURRENCIES.USD : null,
            tokenAddress,
            balanceInBaseCurrency: balanceUsd,
            balanceInSelectedCurrency: balanceUsd,
          })
        }),
    )

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
