// @flow
import type { Store, AnyAction } from 'redux'
import { type GlobalState } from '~/safeStore'
import { ADD_PROVIDER, REMOVE_PROVIDER } from '../actions'
import { getWeb3, getProviderInfo, WALLET_PROVIDER } from '~/logic/wallets/getWeb3'
import { fetchProvider } from '~/logic/wallets/store/actions'
import {
  loadFromStorage, saveToStorage, removeFromStorage, get3Box,
} from '~/utils/storage'
import closeSnackbar from '~/logic/notifications/store/actions/closeSnackbar'
import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'

const watchedActions = [ADD_PROVIDER, REMOVE_PROVIDER]

const LAST_USED_PROVIDER_KEY = 'LAST_USED_PROVIDER'

export const loadLastUsedProvider = async () => {
  const lastUsedProvider = await loadFromStorage(LAST_USED_PROVIDER_KEY)

  return lastUsedProvider || ''
}

let watcherInterval = null

const providerWatcherMware = (store: Store<GlobalState>) => (next: Function) => async (action: AnyAction) => {
  const handledAction = next(action)

  if (watchedActions.includes(action.type)) {
    switch (action.type) {
      case ADD_PROVIDER: {
        get3Box(true)
          .then(() => {
            store.dispatch(loadAddressBookFromStorage(true))
          })
          .catch(() => store.dispatch(loadAddressBookFromStorage()))
        const currentProviderProps = action.payload.toJS()

        if (watcherInterval) {
          clearInterval(watcherInterval)
        }

        if (currentProviderProps.name === WALLET_PROVIDER.METAMASK && window.ethereum) {
          window.ethereum.autoRefreshOnNetworkChange = false
        }

        saveToStorage(LAST_USED_PROVIDER_KEY, currentProviderProps.name)

        watcherInterval = setInterval(async () => {
          const web3 = getWeb3()
          const providerInfo = await getProviderInfo(web3)

          const networkChanged = currentProviderProps.network !== providerInfo.network

          if (networkChanged) {
            store.dispatch(closeSnackbar({ dismissAll: true }))
          }

          if (currentProviderProps.account !== providerInfo.account || networkChanged) {
            store.dispatch(fetchProvider(web3))
          }
        }, 2000)

        break
      }
      case REMOVE_PROVIDER:
        clearInterval(watcherInterval)
        removeFromStorage(LAST_USED_PROVIDER_KEY)
        break
      default:
        break
    }
  }

  return handledAction
}

export default providerWatcherMware
