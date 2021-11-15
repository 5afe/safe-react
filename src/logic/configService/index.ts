import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import axios from 'axios'
import { store } from 'src/store'

import { CONFIG_SERVICE_URL } from 'src/utils/constants'
import { currentNetworkId } from '../config/store/selectors'

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

export const fetchSafeConfig = async (networkId: string): Promise<ChainInfo> => {
  const url = `${CONFIG_SERVICE_URL}/chains/${networkId}`

  return axios.post(url).then(({ data }) => data)
}

export const fetchSafeAppsList = async (): Promise<RemoteAppData[]> => {
  const networkId = currentNetworkId(store.getState())
  return axios.get(`${CONFIG_SERVICE_URL}${Endpoints['SAFE_APPS']}?chainId=${networkId}`).then(({ data }) => data)
}
