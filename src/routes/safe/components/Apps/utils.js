// @flow
import axios from 'axios'

import appsIconSvg from '~/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

const gnosisAppsUrl = process.env.REACT_APP_GNOSIS_APPS_URL
export const staticAppsList = [
  { url: `${gnosisAppsUrl}/compound`, disabled: false },
  { url: `${gnosisAppsUrl}/aave`, disabled: false },
  { url: `${gnosisAppsUrl}/pool-together`, disabled: false },
  { url: `${gnosisAppsUrl}/open-zeppelin`, disabled: false },
  { url: `${gnosisAppsUrl}/request`, disabled: false },
  { url: `${gnosisAppsUrl}/synthetix`, disabled: false },
]

export const getAppInfoFromOrigin = (origin: string) => {
  try {
    return JSON.parse(origin)
  } catch (error) {
    console.error(`Impossible to parse TX from origin: ${origin}`)
    return null
  }
}

export const getAppInfoFromUrl = async (appUrl: string) => {
  let res = { id: undefined, url: appUrl, name: 'unknown', iconUrl: appsIconSvg, error: true }

  if (!appUrl) {
    return res
  }

  res.url = appUrl.trim()
  let noTrailingSlashUrl = res.url
  if (noTrailingSlashUrl.substr(-1) === '/') {
    noTrailingSlashUrl = noTrailingSlashUrl.substr(0, noTrailingSlashUrl.length - 1)
  }

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
}
