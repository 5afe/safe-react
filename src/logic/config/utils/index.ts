import axios from 'axios'
import { _getChainId, _setChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { store } from 'src/store'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { setChainIdAction } from 'src/logic/config/store/actions'

export type RemoteAppData = {
  id: number
  url: string
  name: string
  iconUrl: string
  description: string
  chainIds: number[]
}

const enum Endpoints {
  SAFE_APPS = '/safe-apps/',
}

// TODO: Migrate to GATEWAY_URL when CGW exposes it
export const fetchSafeAppsList = async (): Promise<RemoteAppData[]> => {
  const { data } = await axios.get(`${CONFIG_SERVICE_URL}${Endpoints.SAFE_APPS}?chainId=${_getChainId()}`)
  return data
}

export const setChainId = (newChainId: ChainId) => {
  _setChainId(newChainId)
  store.dispatch(setChainIdAction(newChainId))
}
