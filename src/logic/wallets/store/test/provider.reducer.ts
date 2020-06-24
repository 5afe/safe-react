// 
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import providerReducer, { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import { makeProvider } from 'src/logic/wallets/store/model/provider'
import { processProviderResponse } from '../actions/fetchProvider'

const providerReducerTests = () => {
  describe('Provider List Actions[fetchProvider -> addProvider]', () => {
    let store
    beforeEach(() => {
      const reducers = combineReducers({
        [PROVIDER_REDUCER_ID]: providerReducer,
      })
      const middlewares = [thunk]
      const enhancers = [applyMiddleware(...middlewares)]
      store = createStore(reducers, compose(...enhancers))
    })

    it('reducer should return default Provider record when no provider is loaded', () => {
      // GIVEN
      const emptyProvider = {
        name: '',
        loaded: false,
        available: false,
        account: '',
        network: 0,
      }

      // WHEN
      processProviderResponse(store.dispatch, emptyProvider)
      const provider = store.getState()[PROVIDER_REDUCER_ID]

      // THEN
      expect(makeProvider(emptyProvider)).toEqual(provider)
    })

    it('reducer should return avaiable with its default value when is loaded but not available', () => {
      // GIVEN
      const providerLoaded = {
        name: 'SAFE',
        loaded: true,
        available: false,
        account: '',
        network: 0,
      }

      // WHEN
      processProviderResponse(store.dispatch, providerLoaded)
      const provider = store.getState()[PROVIDER_REDUCER_ID]

      // THEN
      expect(makeProvider(providerLoaded)).toEqual(provider)
    })

    it('reducer should return provider when it is loaded and available', () => {
      // GIVEN
      const providerLoaded = {
        name: 'SAFE',
        loaded: true,
        available: true,
        account: '',
        network: 0,
      }

      // WHEN
      processProviderResponse(store.dispatch, providerLoaded)
      const provider = store.getState()[PROVIDER_REDUCER_ID]

      // THEN
      expect(makeProvider(providerLoaded)).toEqual(provider)
    })
  })
}

export default providerReducerTests
