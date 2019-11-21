// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import { List } from 'immutable'
import type { GlobalState } from '~/store'
import { setCurrencyValues } from '~/logic/currencyValues/store/actions/setCurrencyValues'
import type { CurrencyValuesProps } from '~/logic/currencyValues/store/model/currencyValues'
import { makeCurrencyValue } from '~/logic/currencyValues/store/model/currencyValues'
import { setCurrencySelected } from '~/logic/currencyValues/store/actions/setCurrencySelected'

export const fetchCurencyValues = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    // TODO - Fetch the values from the api, now is mocked
    const currencyValuePairs = [{
      currencyName: 'USD',
      tokensPrice: [{
        currencyPrice: '10.2',
        tokenAddress: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
        tokenName: 'OmiseGO',
      },
      {
        currencyPrice: '1',
        tokenAddress: '0x62f25065BA60CA3A2044344955A3B2530e355111',
        tokenName: 'Dai',
      }],
    }, {
      currencyName: 'EUR',
      tokensPrice: [{
        currencyPrice: '0.9',
        tokenAddress: '0x62f25065BA60CA3A2044344955A3B2530e355111',
        tokenName: 'Dai',
      }, {
        currencyPrice: '9.1',
        tokenAddress: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
        tokenName: 'OmiseGO',
      }],
    }]
    // eslint-disable-next-line max-len
    const currencyValuePairsList = List(currencyValuePairs.map((currencyValue: CurrencyValuesProps) => makeCurrencyValue(currencyValue)))
    dispatch(setCurrencyValues(currencyValuePairsList))
    dispatch(setCurrencySelected(currencyValuePairsList.get(0)))
  } catch (err) {
    console.error('Error fetching tokens price list', err)
  }
  return Promise.resolve()
}

export default fetchCurencyValues
