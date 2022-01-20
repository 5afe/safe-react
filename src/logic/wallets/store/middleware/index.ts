import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { trackAnalyticsEvent, WALLET_EVENTS } from 'src/utils/googleAnalytics'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderPayloads } from 'src/logic/wallets/store/reducer'
import { providerSelector } from '../selectors'

let hasWallet = false
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
    switch (type) {
      case PROVIDER_ACTIONS.WALLET:
      case PROVIDER_ACTIONS.ACCOUNT:
      case PROVIDER_ACTIONS.NETWORK: {
        // Check Onboard subscription payloads
        if (type === PROVIDER_ACTIONS.WALLET) {
          hasWallet = Object.values(payload).every((value) => value != null)
        }
        if (type === PROVIDER_ACTIONS.ACCOUNT) {
          hasAccount = !!payload
        }
        if (type === PROVIDER_ACTIONS.NETWORK) {
          hasNetwork = !!payload
        }

        // Not all provider details are loaded
        if (!hasWallet || !hasAccount || !hasNetwork) {
          break
        }

        // Determine if provider loaded successfully
        const state = store.getState()
        const { available, loaded, name } = providerSelector(state)

        if (!loaded) {
          store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
          break
        }

        if (available) {
          trackAnalyticsEvent({
            ...WALLET_EVENTS.CONNECT_WALLET,
            label: name,
          })
        }

        if (!available) {
          store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
        }

        break
      }
      default:
        break
    }

    return handledAction
  }

export default providerMiddleware
