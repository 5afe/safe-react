import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { trackAnalyticsEvent, WALLET_EVENTS } from 'src/utils/googleAnalytics'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderPayloads } from 'src/logic/wallets/store/reducer'
import { providerSelector } from '../selectors'

const providerMiddleware =
  (store: ReturnType<typeof reduxStore>) =>
  (next: Dispatch) =>
  async (action: Action<ProviderPayloads>): Promise<Action<ProviderPayloads>> => {
    const handledAction = next(action)

    switch (action.type) {
      case PROVIDER_ACTIONS.ACCOUNT: {
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
