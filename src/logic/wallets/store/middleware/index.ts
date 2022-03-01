import { Dispatch } from 'redux'
import { Action } from 'redux-actions'

import { store as reduxStore } from 'src/store'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { trackAnalyticsEvent, WALLET_EVENTS } from 'src/utils/googleAnalytics'
import { PROVIDER_ACTIONS } from 'src/logic/wallets/store/actions'
import { ProviderPayloads } from 'src/logic/wallets/store/reducer'
import { providerSelector } from '../selectors'
import { currentChainId } from 'src/logic/config/store/selectors'
import { isSmartContractWallet } from 'src/logic/wallets/getWeb3'
import { updateProviderSmartContract } from 'src/logic/wallets/store/actions/updateProviderSmartContract'

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
    if (type === PROVIDER_ACTIONS.WALLET) {
      // Wallet has name, hardware/smart contract wallet flag set
      hasWallet = Object.values(payload).some(Boolean)
    } else if (type === PROVIDER_ACTIONS.ACCOUNT) {
      hasAccount = !!payload

      // Check if wallet is smart contract
      const smartContractWallet = typeof payload === 'string' ? await isSmartContractWallet(payload) : false
      store.dispatch(updateProviderSmartContract(smartContractWallet))
    } else if (type === PROVIDER_ACTIONS.NETWORK) {
      hasNetwork = !!payload
    } else {
      return handledAction
    }

    if (!hasWallet || !hasAccount || !hasNetwork) {
      return handledAction
    }

    const state = store.getState()
    const { available, loaded, name, network } = providerSelector(state)

    // @TODO: `loaded` flag that is/was always set to true - should be moved to wallet connection catch
    // Wallet, account and network did not successfully load
    if (!loaded) {
      store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))

      return handledAction
    }

    if (available) {
      // Only track when wallet connects to same chain as chain displayed in UI
      if (currentChainId(state) === network) {
        const event = {
          ...WALLET_EVENTS.CONNECT_WALLET,
          label: name,
        }

        trackAnalyticsEvent(event)
      }
    } else {
      store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
    }

    return handledAction
  }

export default providerMiddleware
