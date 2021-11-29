import { ChainListResponse, getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { Action } from 'redux'
import { ChainId } from 'src/config'
import { clearCurrentSession } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { CONFIG_ACTIONS } from '../actions'
import { ConfigPayload, CONFIG_REDUCER_ID, _chains } from '../reducer'

// Recursively load pages of chains until network is found
const getChains = async (networkId: ChainId): Promise<void> => {
  const hasChain = _chains.results.some((network) => network?.chainId === networkId)
  if (hasChain) {
    return
  }

  const { results, next } = _chains
  const baseUrl = results.length > 0 && next ? next : CONFIG_SERVICE_URL

  const res = await getChainsConfig(baseUrl)

  _chains.next = res.next
  _chains.results = [...results, ...res.results]

  getChains(networkId)
}

export const configMiddleware = (store) => (next: Dispatch) => async (action: Action<ConfigPayload>) => {
  const isWatched = Object.keys(CONFIG_ACTIONS).includes(action.type)

  if (!isWatched) {
    return
  }

  switch (action.type) {
    case CONFIG_ACTIONS.SET_CHAIN_ID: {
      const state = store.getState()
      const { networkId } = state[CONFIG_REDUCER_ID]
      try {
        await getChains(networkId)
      } catch (err) {
        //TODO: log
      } finally {
        ;[clearSafeList, clearCurrentSession, loadSafesFromStorage, loadCurrentSessionFromStorage].forEach(
          store.dispatch,
        )
      }
      break
    }
    default:
      break
  }

  return next(action)
}
