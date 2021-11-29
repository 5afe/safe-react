import { getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { Action } from 'redux'
import { ChainId, _getChainId } from 'src/config'
import { clearCurrentSession } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import loadCurrentSessionFromStorage from 'src/logic/currentSession/store/actions/loadCurrentSessionFromStorage'
import { clearSafeList } from 'src/logic/safe/store/actions/clearSafeList'
import loadSafesFromStorage from 'src/logic/safe/store/actions/loadSafesFromStorage'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { CONFIG_ACTIONS } from '../actions'
import { ConfigPayload, _chains } from '../reducer'

const hasChain = (chainId: ChainId): boolean => _chains.results.some((chain) => chain?.chainId === chainId)

// Recursively load pages of chains until network is found
const getChains = async (chainId: ChainId): Promise<void> => {
  if (hasChain(chainId)) {
    return
  }

  const baseUrl = _chains.results.length > 0 && _chains.next ? _chains.next : CONFIG_SERVICE_URL
  const { next, results = [] } = await getChainsConfig(baseUrl)

  _chains.next = next
  _chains.results = [..._chains.results, ...results]

  if (hasChain(chainId)) {
    return
  }

  getChains(chainId)
}

export const configMiddleware =
  ({ dispatch }) =>
  (next: Dispatch) =>
  async (action: Action<ConfigPayload>) => {
    const isWatched = Object.keys(CONFIG_ACTIONS).includes(action.type)

    if (!isWatched) {
      return
    }

    switch (action.type) {
      case CONFIG_ACTIONS.SET_CHAIN_ID: {
        try {
          await getChains(_getChainId())

          dispatch(clearSafeList())
          dispatch(clearCurrentSession())
          dispatch(loadSafesFromStorage())
          dispatch(loadCurrentSessionFromStorage())
        } catch (err) {
          //TODO: log
        }
        break
      }
      default:
        break
    }

    return next(action)
  }
