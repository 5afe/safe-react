import axios from 'axios'
import memoize from 'lodash.memoize'

import { SafeApp, SAFE_APP_LOADING_STATUS } from './types.d'

import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import { SAFE_APPS_LIST_PROVIDER_URL } from 'src/utils/constants'
// import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

const removeLastTrailingSlash = (url) => {
  if (url.substr(-1) === '/') {
    return url.substr(0, url.length - 1)
  }
  return url
}

type AppsList = {
  name: string
  url: string
  disabled: boolean
  networks: number[]
}

export const getAppsList = async (): Promise<AppsList[]> => {
  if (!SAFE_APPS_LIST_PROVIDER_URL) {
    throw Error('There is not SAFE_APPS_LIST_PROVIDER_URL defined')
  }

  const res = await axios.get<{ safeAppsList: AppsList[] }>(`${SAFE_APPS_LIST_PROVIDER_URL}/manifest.json`)

  return res.data.safeAppsList
}

export const getAppInfoFromOrigin = (origin: string): { url: string; name: string } | null => {
  try {
    return JSON.parse(origin)
  } catch (error) {
    console.error(`Impossible to parse TX from origin: ${origin}`)
    return null
  }
}

export const isAppManifestValid = (appInfo: SafeApp): boolean =>
  // `appInfo` exists and `name` exists
  !!appInfo?.name &&
  // if `name` exists is not 'unknown'
  appInfo.name !== 'unknown' &&
  // `description` exists
  !!appInfo.description &&
  // `url` exists
  !!appInfo.url &&
  // no `error` (or `error` undefined)
  !appInfo.error

export const getEmptySafeApp = (): SafeApp => {
  return {
    id: Math.random().toString(),
    url: '',
    name: 'unknown',
    iconUrl: appsIconSvg,
    error: false,
    description: '',
    loadingStatus: SAFE_APP_LOADING_STATUS.ADDED,
  }
}

export const getAppInfoFromUrl = memoize(
  async (appUrl: string): Promise<SafeApp> => {
    let res = {
      ...getEmptySafeApp(),
      error: true,
      loadingStatus: SAFE_APP_LOADING_STATUS.ERROR,
    }

    if (!appUrl?.length) {
      return res
    }

    res.url = appUrl.trim()
    const noTrailingSlashUrl = removeLastTrailingSlash(res.url)

    try {
      const appInfo = await axios.get(`${noTrailingSlashUrl}/manifest.json`, { timeout: 5_000 })

      // verify imported app fulfil safe requirements
      if (!appInfo?.data || isAppManifestValid(appInfo.data)) {
        throw Error('The app does not fulfil the structure required.')
      }

      // the DB origin field has a limit of 100 characters
      const originFieldSize = 100
      const jsonDataLength = 20
      const remainingSpace = originFieldSize - res.url.length - jsonDataLength

      res = {
        ...res,
        ...appInfo.data,
        id: JSON.stringify({ url: res.url, name: appInfo.data.name.substring(0, remainingSpace) }),
        error: false,
        loadingStatus: SAFE_APP_LOADING_STATUS.SUCCESS,
      }

      if (appInfo.data.iconPath) {
        try {
          const iconInfo = await axios.get(`${noTrailingSlashUrl}/${appInfo.data.iconPath}`, { timeout: 1000 * 10 })
          if (/image\/\w/gm.test(iconInfo.headers['content-type'])) {
            res.iconUrl = `${noTrailingSlashUrl}/${appInfo.data.iconPath}`
          }
        } catch (error) {
          console.error(`It was not possible to fetch icon from app ${res.url}`)
        }
      }
      return res
    } catch (error) {
      console.error(`It was not possible to fetch app from ${res.url}: ${error.message}`)
      return res
    }
  },
)

export const getIpfsLinkFromEns = memoize(
  async (name: string): Promise<string | undefined> => {
    try {
      const content = await getContentFromENS(name)
      if (content && content.protocolType === 'ipfs') {
        return `${process.env.REACT_APP_IPFS_GATEWAY}/${content.decoded}/`
      }
    } catch (error) {
      console.error(error)
      return
    }
  },
)

export const uniqueApp = (appList: SafeApp[]) => (url: string): string | undefined => {
  const exists = appList.some((a) => {
    try {
      const currentUrl = new URL(a.url)
      const newUrl = new URL(url)
      return currentUrl.href === newUrl.href
    } catch (error) {
      console.error('There was a problem trying to validate the URL existence.', error.message)
      return false
    }
  })
  return exists ? 'This app is already registered.' : undefined
}
