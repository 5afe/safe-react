import { getChainsConfig } from '@gnosis.pm/safe-react-gateway-sdk'
import { createAction } from 'redux-actions'

import { ChainId, _getChainId } from 'src/config'
import { Dispatch } from 'src/logic/safe/store/actions/types'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { addChains } from '../reducer'

export enum CONFIG_ACTIONS {
  SET_CHAIN_ID = 'SET_CHAIN_ID',
}

export const setChainId = createAction<ChainId>(CONFIG_ACTIONS.SET_CHAIN_ID)

// Recursively load pages of chains
export const loadChains = async (baseUrl = CONFIG_SERVICE_URL): Promise<void> => {
  const { next, results = [] } = await getChainsConfig(baseUrl)

  if (results.length === 0) {
    return
  }

  addChains(results)

  if (next) {
    loadChains(next)
  }
}

export const initChains =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      await loadChains()
      dispatch(setChainId(_getChainId()))
    } catch (err) {
      console.error('Error while getting network configuration:', err)
    }
  }
