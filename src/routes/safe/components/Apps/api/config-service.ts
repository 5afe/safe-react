import axios from 'axios'
import { getNetworkId } from 'src/config'
import { SAFE_APPS_LIST_URL } from 'src/utils/constants'

export type TokenListResult = {
  name: string
  timestamp: string
  apps: AppData[]
}

export type AppData = {
  url: string
  name?: string
  disabled?: boolean
  description?: string
  networks: number[]
}

export const fetchSafeAppsList = async (): Promise<TokenListResult> => {
  const networkId = getNetworkId()
  return axios.get(`${SAFE_APPS_LIST_URL}?network_id=${networkId}`).then(({ data }) => data)
}
