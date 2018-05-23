// @flow
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import safeReducer, { calculateInitialState, SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import addSafe from '~/routes/safe/store/actions/addSafe'
import * as SafeFields from '~/routes/open/components/fields'
import { getAccountsFrom, getNamesFrom } from '~/routes/open/utils/safeDataExtractor'
import { SafeFactory } from './builder/safe.builder'

const aStore = (initState) => {
  const reducers = combineReducers({
    [SAFE_REDUCER_ID]: safeReducer,
  })
  const middlewares = [
    thunk,
  ]
  const enhancers = [
    applyMiddleware(...middlewares),
  ]
  return createStore(reducers, initState, compose(...enhancers))
}

const providerReducerTests = () => {
  describe('Safe Actions[addSafe]', () => {
    let store
    let address
    let formValues
    beforeEach(() => {
      store = aStore()
      address = '0x03db1a8b26d08df23337e9276a36b474510f0025'
      formValues = {
        [SafeFields.FIELD_NAME]: 'Adol ICO Safe',
        [SafeFields.FIELD_CONFIRMATIONS]: 1,
        [SafeFields.FIELD_OWNERS]: 1,
        [SafeFields.FIELD_DAILY_LIMIT]: 10,
        [SafeFields.getOwnerAddressBy(0)]: '0x03db1a8b26d08df23337e9276a36b474510f0023',
        [SafeFields.getOwnerNameBy(0)]: 'Adol Metamask',
        address,
      }
    })

    it('reducer should return SafeRecord from form values', () => {
      // GIVEN in beforeEach method

      // WHEN
      store.dispatch(addSafe(
        formValues[SafeFields.FIELD_NAME],
        formValues.address,
        formValues[SafeFields.FIELD_CONFIRMATIONS],
        formValues[SafeFields.FIELD_DAILY_LIMIT],
        getNamesFrom(formValues),
        getAccountsFrom(formValues),
      ))
      const safes = store.getState()[SAFE_REDUCER_ID]

      // THEN
      expect(safes.get(address)).toEqual(SafeFactory.oneOwnerSafe())
    })

    it('reducer loads information from localStorage', async () => {
      // GIVEN in beforeEach method

      // WHEN
      store.dispatch(addSafe(
        formValues[SafeFields.FIELD_NAME],
        formValues.address,
        formValues[SafeFields.FIELD_CONFIRMATIONS],
        formValues[SafeFields.FIELD_DAILY_LIMIT],
        getNamesFrom(formValues),
        getAccountsFrom(formValues),
      ))

      const anotherStore = aStore({ [SAFE_REDUCER_ID]: calculateInitialState() })
      const safes = anotherStore.getState()[SAFE_REDUCER_ID]

      // THEN
      expect(calculateInitialState()).toEqual(safes)
    })
  })
}

export default providerReducerTests
