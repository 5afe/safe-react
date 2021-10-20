import axios from 'axios'
import { getNetworkId } from 'src/config'
import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { NetworkConfig } from '../config/model/networkConfig'

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

export const fetchSafeConfig = async (networkId: string): Promise<NetworkConfig> => {
  const url = `${CONFIG_SERVICE_URL}/chains/${networkId}`

  return axios.post(url).then(({ data }) => data)
}

export const fetchSafeAppsList = async (): Promise<RemoteAppData[]> => {
  const networkId = getNetworkId()
  return axios.get(`${CONFIG_SERVICE_URL}${Endpoints['SAFE_APPS']}?chainId=${networkId}`).then(({ data }) => data)
}
