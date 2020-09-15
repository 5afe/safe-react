import { setCurrencyBalances } from 'src/logic/currencyValues/store/actions/setCurrencyBalances'
import { setCurrencyRate } from 'src/logic/currencyValues/store/actions/setCurrencyRate'
import { setSelectedCurrency } from 'src/logic/currencyValues/store/actions/setSelectedCurrency'
import { AVAILABLE_CURRENCIES } from 'src/logic/currencyValues/store/model/currencyValues'
import { loadSelectedCurrency } from 'src/logic/currencyValues/store/utils/currencyValuesStorage'
import { Dispatch } from 'redux'

export const fetchSelectedCurrency = (safeAddress: string) => async (
  dispatch: Dispatch<typeof setCurrencyBalances | typeof setSelectedCurrency | typeof setCurrencyRate>,
): Promise<void> => {
  try {
    const storedSelectedCurrency = await loadSelectedCurrency()

    dispatch(setSelectedCurrency(safeAddress, storedSelectedCurrency || AVAILABLE_CURRENCIES.USD))
  } catch (err) {
    console.error('Error fetching currency values', err)
  }
  return Promise.resolve()
}
