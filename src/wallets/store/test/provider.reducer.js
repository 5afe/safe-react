// @flow
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import providerReducer, { REDUCER_ID } from '~/wallets/store/reducer/provider'
import type { ProviderProps } from '~/wallets/store/model/provider'
import { makeProvider } from '~/wallets/store/model/provider'
import { processProviderResponse } from '../actions/fetchProvider'

const providerReducerTests = () => {
  describe('Provider List Actions[fetchProvider -> addProvider]', () => {
    let store
    beforeEach(() => {
      const reducers = combineReducers({
        [REDUCER_ID]: providerReducer,
      })
      const middlewares = [
        thunk,
      ]
      const enhancers = [
        applyMiddleware(...middlewares),
      ]
      store = createStore(reducers, compose(...enhancers))
    })

    it('reducer should return default Provider record when no Metamask is loaded', () => {
      // GIVEN
      const emptyResponse: ProviderProps = { name: '', loaded: false, available: false }

      // WHEN
      processProviderResponse(store.dispatch, emptyResponse)
      const provider = store.getState()[REDUCER_ID]

      // THEN
      expect(makeProvider(emptyResponse)).toEqual(provider)
    })

    it('reducer should return avaiable with its default value when is loaded but not available', () => {
      // GIVEN
      const metamaskLoaded: ProviderProps = { name: 'METAMASK', loaded: true, available: false }

      // WHEN
      processProviderResponse(store.dispatch, metamaskLoaded)
      const provider = store.getState()[REDUCER_ID]

      // THEN
      expect(makeProvider(metamaskLoaded)).toEqual(provider)
    })

    it('reducer should return metamask provider when it is loaded and available', () => {
      // GIVEN
      const metamask: ProviderProps = { name: 'METAMASK', loaded: true, available: true }

      // WHEN
      processProviderResponse(store.dispatch, metamask)
      const provider = store.getState()[REDUCER_ID]

      // THEN
      expect(makeProvider(metamask)).toEqual(provider)
    })
  })
}

export default providerReducerTests
