import axios from 'axios'
import memoize from 'lodash.memoize'

import { SafeApp } from './types.d'

import { getGnosisSafeAppsUrl } from 'src/config'
import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

const removeLastTrailingSlash = (url) => {
  if (url.substr(-1) === '/') {
    return url.substr(0, url.length - 1)
  }
  return url
}

const gnosisAppsUrl = removeLastTrailingSlash(getGnosisSafeAppsUrl())
export const staticAppsList: Array<{ url: string; disabled: boolean; networks: number[] }> = [
  // 1inch
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmUDTSghr154kCCGguyA3cbG5HRVd2tQgNR7yD69bcsjm5`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Aave
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmY1MUZo44UkT8EokYHs7xDvWEziYSn7n3c4ojVB6qo3SM`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  //Balancer Exchange
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmfPLXne1UrY399RQAcjD1dmBhQrPGZWgp311CDLLW3VTn`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  //Balancer Pool
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmaTucdZYLKTqaewwJduVMM8qfCDhyaEqjd8tBNae26K1J`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET],
  },
  // Compound
  { url: `${gnosisAppsUrl}/compound`, disabled: false, networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY] },
  // Idle
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmZ3oug89a3BaVqdJrJEA8CKmLF4M8snuAnphR6z1yq8V8`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // request
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmTBBaiDQyGa17DJ7DdviyHbc51fTVgf6Z5PW5w2YUTkgR`,
    disabled: false,
    networks: [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY],
  },
  // Sablier
  {
    url: `${process.env.REACT_APP_IPFS_GATEWAY}/QmboeZ9bae26Skg5xskCsXWjJuLjYk7aHgPh4BAnfRBDgo`,
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
      ETHEREUM_NETWORK.ENERGY_WEB_CHAIN,
      ETHEREUM_NETWORK.VOLTA,
      // ETHEREUM_NETWORK.XDAI,
    ],
  },
  // TX-Builder
  {
    url: `${gnosisAppsUrl}/tx-builder`,
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
    url: `${gnosisAppsUrl}/walletConnect`,
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

export const getAppInfoFromOrigin = (origin: string): Record<string, string> | null => {
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

export const getAppInfoFromUrl = memoize(
  async (appUrl: string): Promise<SafeApp> => {
    let res = { id: '', url: appUrl, name: 'unknown', iconUrl: appsIconSvg, error: true, description: '' }

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
