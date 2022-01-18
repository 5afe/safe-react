import { Dispatch } from 'redux'

import { ChainId } from 'src/config/chain'
import closeSnackbar from 'src/logic/notifications/store/actions/closeSnackbar'
import { getAccountFrom, getChainIdFrom, getWeb3 } from 'src/logic/wallets/getWeb3'
import { fetchProvider } from 'src/logic/wallets/store/actions'
import { ADD_PROVIDER } from 'src/logic/wallets/store/actions/addProvider'
import { REMOVE_PROVIDER } from 'src/logic/wallets/store/actions/removeProvider'
import { store as reduxStore } from 'src/store/index'
import { loadFromStorage, removeFromStorage, saveToStorage } from 'src/utils/storage'
import { ProviderState } from '../reducer/provider'

const watchedActions = [ADD_PROVIDER, REMOVE_PROVIDER]

const LAST_USED_PROVIDER_KEY = 'LAST_USED_PROVIDER'

export const loadLastUsedProvider = async (): Promise<string | undefined> => {
  const lastUsedProvider = await loadFromStorage<string>(LAST_USED_PROVIDER_KEY)

  return lastUsedProvider
}

type ProviderWatcherAction = {
  type: string
  payload: ProviderState
}

let watcherInterval: NodeJS.Timer
const providerWatcherMware =
  (store: ReturnType<typeof reduxStore>) =>
  (next: Dispatch) =>
  async (action: ProviderWatcherAction): Promise<ProviderWatcherAction> => {
    const handledAction = next(action)

    if (watchedActions.includes(action.type)) {
      switch (action.type) {
        case ADD_PROVIDER: {
          const currentProviderProps = action.payload.toJS()

          if (watcherInterval) {
            clearInterval(watcherInterval)
          }

          saveToStorage(LAST_USED_PROVIDER_KEY, currentProviderProps.name)

          watcherInterval = setInterval(async () => {
            const web3 = getWeb3()

            const network = (await getChainIdFrom(web3)).toString() as ChainId
            const account = await getAccountFrom(web3)

            const hasChangedNetwork = currentProviderProps.network !== network
            const hasChangedAccount = currentProviderProps.account !== account

            if (hasChangedNetwork) {
              store.dispatch(closeSnackbar({ dismissAll: true }))
            }

            if (hasChangedNetwork || hasChangedAccount) {
              store.dispatch(fetchProvider(currentProviderProps.name))
            }
          }, 2000)

          break
        }
        case REMOVE_PROVIDER:
          clearInterval(watcherInterval)
          if (!action.payload?.keepStorageKey) {
            removeFromStorage(LAST_USED_PROVIDER_KEY)
          }
          break
        default:
          break
      }
    }

    return handledAction
  }

export default providerWatcherMware
