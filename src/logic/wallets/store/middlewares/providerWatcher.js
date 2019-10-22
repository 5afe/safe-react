// @flow
import type { Store, AnyAction } from 'redux'
import { type GlobalState } from '~/store/'
import { ADD_PROVIDER, REMOVE_PROVIDER } from '../actions'
import { getWeb3, getProviderInfo } from '~/logic/wallets/getWeb3'
import { fetchProvider } from '~/logic/wallets/store/actions'

const watchedActions = [ADD_PROVIDER, REMOVE_PROVIDER]

let watcherInterval = null

const providerWatcherMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case ADD_PROVIDER: {
        const currentProviderProps = action.payload.toJS()

        if (watcherInterval) {
          clearInterval(watcherInterval)
        }

        watcherInterval = setInterval(async () => {
          const web3 = getWeb3()
          const providerInfo = await getProviderInfo(web3)

          if (
            currentProviderProps.account !== providerInfo.account
            || currentProviderProps.network !== providerInfo.network
          ) {
            store.dispatch(fetchProvider(web3, () => {}, () => {}))
          }
        }, 2000)

        break
      }
      case REMOVE_PROVIDER:
        clearInterval(watcherInterval)
        break
      default:
        break
    }
  }

  return handledAction
}

export default providerWatcherMware
