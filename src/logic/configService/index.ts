import axios from 'axios'
import { getConfig, getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'

export type AppData = {
  url: string
  name?: string
  disabled?: boolean
  description?: string
  networks: ETHEREUM_NETWORK[]
  custom?: boolean
}

enum Endpoints {
  SAFE_APPS = '/safe-apps/',
}

export const fetchSafeAppsList = async (): Promise<AppData[]> => {
  const networkId = getNetworkId()
  const config = getConfig()
  return axios.get(`${config.configServiceUrl}${Endpoints['SAFE_APPS']}?chainId=${networkId}`).then(({ data }) => data)
}
