import axios from 'axios'
import { _getChainId } from 'src/config'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

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
