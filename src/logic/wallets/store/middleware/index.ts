import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderPayloads } from 'src/logic/wallets/store/reducer'
import { providerSelector } from '../selectors'
import { trackEvent } from 'src/utils/googleTagManager'
import { WALLET_EVENTS } from 'src/utils/events/wallet'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { resetWeb3, setWeb3 } from '../../getWeb3'
import onboard, { removeLastUsedProvider, saveLastUsedProvider } from '../../onboard'

let hasWalletName = false
let hasAccount = false
let hasNetwork = false

const providerMiddleware =
  (store: ReturnType<typeof reduxStore>) =>
  (next: Dispatch) =>
  async (action: Action<ProviderPayloads>): Promise<Action<ProviderPayloads>> => {
    const handledAction = next(action)

    const { type, payload } = action

    // Onboard sends provider details via separate subscriptions: wallet, account, network
    // Payloads from all three need to be combined to be `loaded` and `available`
    if (type === PROVIDER_ACTIONS.WALLET_NAME) {
      hasWalletName = !!payload
    } else if (type === PROVIDER_ACTIONS.ACCOUNT) {
      hasAccount = !!payload
    } else if (type === PROVIDER_ACTIONS.NETWORK) {
      hasNetwork = !!payload
    } else {
      // Dispatched actions from reducers unrelated to wallet
      return handledAction
    }

    // No wallet is connected via onboard
    if (!hasWalletName && !hasAccount && !hasNetwork) {
      resetWeb3()
      removeLastUsedProvider()
    }

    // Wallet 'partially' connected: only a subset of onboard subscription(s) have fired
    if (!hasWalletName || !hasAccount || !hasNetwork) {
      return handledAction
    }

    const state = store.getState()
    const { available, loaded, name, account } = providerSelector(state)

    // @TODO: `loaded` flag that is/was always set to true - should be moved to wallet connection catch
    // Wallet, account and network did not successfully load
    if (!loaded) {
      store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      return handledAction
    }

    if (!available) {
      store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
      return handledAction
    }

    // Instantiate web3/contract
    const { wallet } = onboard().getState()
    if (wallet.provider) {
      setWeb3(wallet.provider)
      instantiateSafeContracts()
    }

    if (name) {
      saveLastUsedProvider(name)
      // Only track when account has been successfully saved to store
      if (payload === account) {
        trackEvent({ ...WALLET_EVENTS.CONNECT, label: name })
      }
    }

    return handledAction
  }

export default providerMiddleware
