import axios from 'axios'
import memoize from 'lodash.memoize'

import { SafeApp } from './types'

import { getGnosisSafeAppsUrl } from 'src/config/index'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

const removeLastTrailingSlash = (url) => {
  if (url.substr(-1) === '/') {
    return url.substr(0, url.length - 1)
  }
  return url
}

const gnosisAppsUrl = removeLastTrailingSlash(getGnosisSafeAppsUrl())
export const staticAppsList: Array<{ url: string; disabled: boolean }> = [
  // 1inch
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmUDTSghr154kCCGguyA3cbG5HRVd2tQgNR7yD69bcsjm5`, disabled: false },
  // Aave
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmY1MUZo44UkT8EokYHs7xDvWEziYSn7n3c4ojVB6qo3SM`, disabled: false },
  // Compound
  { url: `${gnosisAppsUrl}/compound`, disabled: false },
  // Idle
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmUoqmq8jw98VwTSf7aTQeBCfPKicQgcJL5k2Bch9QT8BJ`, disabled: false },
  // request
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmTBBaiDQyGa17DJ7DdviyHbc51fTVgf6Z5PW5w2YUTkgR`, disabled: false },
  // Sablier
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmabPEk7g4zaytFefp6fE4nz8f85QMJoWmRQQZypvJViNG`, disabled: false },
  // Synthetix
  { url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmS6PvFksTQHzxWCNGQ1vto6S9TdVrP83EgLd545DK3aQN`, disabled: false },
  // TX-Builder
  { url: `${gnosisAppsUrl}/tx-builder`, disabled: false },
]

export const getAppInfoFromOrigin = (origin: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(origin)
  } catch (error) {
    console.error(`Impossible to parse TX from origin: ${origin}`)
    return null
  }
}

export const getAppInfoFromUrl = memoize(
  async (appUrl?: string): Promise<SafeApp> => {
    let res = { id: undefined, url: appUrl, name: 'unknown', iconUrl: appsIconSvg, error: true }

    if (!appUrl?.length) {
      return res
    }

    res.url = appUrl.trim()
    const noTrailingSlashUrl = removeLastTrailingSlash(res.url)

    try {
      const appInfo = await axios.get(`${noTrailingSlashUrl}/manifest.json`)

      // verify imported app fulfil safe requirements
      if (!appInfo || !appInfo.data || !appInfo.data.name || !appInfo.data.description) {
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
