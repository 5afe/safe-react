import axios from 'axios'
import { ChainId, CHAIN_ID_KEY, _getChainId, _setChainId } from 'src/config'
import { store } from 'src/store'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { saveToSessionStorage } from 'src/utils/storage/session'
import { setChainId as setChainIdAction } from 'src/logic/config/store/actions'

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

export const fetchSafeAppsList = async (): Promise<RemoteAppData[]> => {
  const { data } = await axios.get(`${CONFIG_SERVICE_URL}${Endpoints.SAFE_APPS}?chainId=${_getChainId()}`)
  return data
}

export const setChainId = (newChainId: ChainId) => {
  _setChainId(newChainId)
  saveToSessionStorage(CHAIN_ID_KEY, newChainId) // Used outside of [ADDRESSED_ROUTE] routes
  store.dispatch(setChainIdAction(newChainId))
}
