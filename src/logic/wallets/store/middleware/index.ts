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

let hasName = false
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
      hasName = !!payload
    } else if (type === PROVIDER_ACTIONS.ACCOUNT) {
      hasAccount = !!payload
    } else if (type === PROVIDER_ACTIONS.NETWORK) {
      hasNetwork = !!payload
    } else {
      return handledAction
    }

    if (!hasName || !hasAccount || !hasNetwork) {
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

    if (available && name) {
      // Only track when account has been successfully saved to store
      if (payload === account) {
        trackEvent({ ...WALLET_EVENTS.CONNECT, label: name })
      }
    } else {
      store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
    }

    return handledAction
  }

export default providerMiddleware
