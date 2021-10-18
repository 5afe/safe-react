import axios from 'axios'
import { getNetworkId } from 'src/config'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'

export type RemoteAppData = {
  id: number
  url: string
  name: string
  iconUrl: string
  description: string
  chainIds: number[]
}

enum Endpoints {
  SAFE_APPS = '/safe-apps/',
}

export const fetchSafeAppsList = async (): Promise<RemoteAppData[]> => {
  const networkId = getNetworkId()
  return axios.get(`${CONFIG_SERVICE_URL}${Endpoints['SAFE_APPS']}?chainId=${networkId}`).then(({ data }) => data)
}
