import axios from 'axios'

// import { getSafeServiceBaseUrl } from 'src/config'

export type TokenListResult = {
  name: string
  timestamp: string
  apps: AppData[]
}

export type AppData = {
  name?: string
  url: string
  disabled?: boolean
  networks: number[]
}

export const fetchAppList = (): Promise<TokenListResult> => {
  const url = 'https://raw.githubusercontent.com/gnosis/safe-apps-list/main/public/gnosis-default.applist.json'

  return axios.get(url).then(({ data }) => data)
}
