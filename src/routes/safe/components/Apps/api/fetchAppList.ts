import axios from 'axios'

import { SAFE_APPS_LIST_URL } from 'src/utils/constants'

export type TokenListResult = {
  name: string
  timestamp: string
  apps: AppData[]
}

export type AppData = {
  name?: string
  url: string
  disabled?: boolean
  description?: string
  networks: number[]
}

export const fetchAppList = async (): Promise<TokenListResult> => {
  return axios.get(SAFE_APPS_LIST_URL).then(({ data }) => data)
}
