import axios from 'axios'
import memoize from 'lodash.memoize'

import { SafeApp, SAFE_APP_FETCH_STATUS } from './types.d'

import { getGnosisSafeAppsUrl } from 'src/config'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/assets/icons/apps.svg'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

export const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

const removeLastTrailingSlash = (url) => {
  if (url.substr(-1) === '/') {
    return url.substr(0, url.length - 1)
  }
  return url
}

const gnosisAppsUrl = removeLastTrailingSlash(getGnosisSafeAppsUrl())
export type StaticAppInfo = {
  url: string
  disabled: boolean
  networks: number[]
}
export const staticAppsList: Array<StaticAppInfo> = [
  // 1inch
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmRWtuktjfU6WMAEJFgzBC4cUfqp3FF5uN9QoWb55SdGG5`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Aave
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmQ3w2ezp2zx3u2LYQHyuNzMrLDJFjyL1rjAFTjNMcQ4cK`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  //Balancer Exchange
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmRb2VfPVYBrv6gi2zDywgVgTg3A19ZCRMqwL13Ez5f5AS`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Balancer Pool
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmVaxypk2FTyfcTS9oZKxmpQziPUTu2VRhhW7sso1mGysf`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // CMM
  // Point to a static server to allow app update without Safe deployment
  {
    url: `https://safe-cmm.gnosis.io`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.RINKEBY, ETHEREUM_NETWORK.XDAI],
  },
  // Compound
  { url: `${gnosisAppsUrl}/compound`, disabled: false, networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY] },
  // dHedge
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmaiemnumMaaK9wE1pbMfm3YSBUpcFNgDh3Bf6VZCZq57Q`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Idle
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmVkGHm6gfQumJhnRfFCh7m2oSYwLXb51EKHzChpcV9J3N`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // Lido finance
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/Qmde8dsa9r8bB59CNGww6LRiaZABuKaJfuzvu94hFkatJC`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Mushrooms finance
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmQs6CUbMUyKe3Sa3tU3HcnWWzsuCk8oJEk8CZKhRcJfEh`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Pooltogether
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmTa21pi77hiT1sLCGy5BeVwcyzExUSp2z7byxZukye8hr`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // Request
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmTBBaiDQyGa17DJ7DdviyHbc51fTVgf6Z5PW5w2YUTkgR`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Sablier
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/Qmb1Xpfu9mnX4A3trpoVeBZ9sTiNtEuRoFKEiaVXWntDxB`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // Synthetix
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmXLxxczMH4MBEYDeeN9zoiHDzVkeBmB5rBjA3UniPEFcA`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // OpenZeppelin
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmQovvfYYMUXjZfNbysQDUEXR8nr55iJRwcYgJQGJR7KEA`,
    disabled: false,
    networks: [
      ETHEREUM_NETWORK.MAINNET,
      ETHEREUM_NETWORK.RINKEBY,
      //ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
      //ETHEREUM_NETWORK.VOLTA,
      // ETHEREUM_NETWORK.XDAI,
    ],
  },
  // TX-Builder
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmZBgEvjqi9Jg8xATr9uUgNUVmnfYiECNxZv9Taux7mzgV`,
    disabled: false,
    networks: [
      ETHEREUM_NETWORK.MAINNET,
      ETHEREUM_NETWORK.RINKEBY,
      ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
      ETHEREUM_NETWORK.VOLTA,
      ETHEREUM_NETWORK.XDAI,
    ],
  },
  // Wallet-Connect
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmRMGTA5ARMwfhYbdmK83zzMd13NnEUKFJSZEgEjKa8YQm`,
    disabled: false,
    networks: [
      ETHEREUM_NETWORK.MAINNET,
      ETHEREUM_NETWORK.RINKEBY,
      ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
      ETHEREUM_NETWORK.VOLTA,
      ETHEREUM_NETWORK.XDAI,
    ],
  },
  // Yearn Vaults
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/Qme9HuPPhgCtgfj1CktvaDKhTesMueGCV2Kui1Sqna3Xs9`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
]

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
    fetchStatus: SAFE_APP_FETCH_STATUS.LOADING,
  }
}

export const getAppInfoFromUrl = memoize(
  async (appUrl: string): Promise<SafeApp> => {
    let res = {
      ...getEmptySafeApp(),
      error: true,
      loadingStatus: SAFE_APP_FETCH_STATUS.ERROR,
    }

    if (!appUrl?.length) {
      return res
    }

    res.url = appUrl.trim()
    const noTrailingSlashUrl = removeLastTrailingSlash(res.url)

    try {
      const appInfo = await axios.get(`${noTrailingSlashUrl}/manifest.json`, { timeout: 5_000 })

      // verify imported app fulfil safe requirements
      if (!appInfo?.data || !isAppManifestValid(appInfo.data)) {
        throw Error('The app does not fulfil the structure required.')
      }

      // the DB origin field has a limit of 100 characters
      const originFieldSize = 100
      const jsonDataLength = 20
      const remainingSpace = originFieldSize - res.url.length - jsonDataLength

      const appInfoData = {
        name: appInfo.data.name,
        iconPath: appInfo.data.iconPath,
        description: appInfo.data.description,
        providedBy: appInfo.data.providedBy,
      }

      res = {
        ...res,
        ...appInfoData,
        id: JSON.stringify({ url: res.url, name: appInfo.data.name.substring(0, remainingSpace) }),
        error: false,
        loadingStatus: SAFE_APP_FETCH_STATUS.SUCCESS,
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
  const newUrl = new URL(url)
  const exists = appList.some((a) => {
    try {
      const currentUrl = new URL(a.url)
      return currentUrl.href === newUrl.href
    } catch (error) {
      console.error('There was a problem trying to validate the URL existence.', error.message)
      return false
    }
  })
  return exists ? 'This app is already registered.' : undefined
}
