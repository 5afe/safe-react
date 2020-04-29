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

  let cleanedUpAppUrl = appUrl.trim()
  res.url = cleanedUpAppUrl
  if (cleanedUpAppUrl.substr(-1) === '/') {
    cleanedUpAppUrl = cleanedUpAppUrl.substr(0, cleanedUpAppUrl.length - 1)
  }

  try {
    const appInfo = await axios.get(`${cleanedUpAppUrl}/manifest.json`)

    // verify imported app fulfil safe requirements
    if (!appInfo || !appInfo.data || !appInfo.data.name || !appInfo.data.description) {
      throw Error('The app does not fulfil the structure required.')
    }

    res = {
      ...res,
      ...appInfo.data,
      id: JSON.stringify({ url: cleanedUpAppUrl, name: appInfo.data.name }),
      error: false,
    }
    if (appInfo.data.iconPath) {
      try {
        const iconInfo = await axios.get(`${cleanedUpAppUrl}/${appInfo.data.iconPath}`)
        if (/image\/\w/gm.test(iconInfo.headers['content-type'])) {
          res.iconUrl = `${cleanedUpAppUrl}/${appInfo.data.iconPath}`
        }
      } catch (error) {
        console.error(`It was not possible to fetch icon from app ${cleanedUpAppUrl}`)
      }
    }

    return res
  } catch (error) {
    console.error(`It was not possible to fetch app from ${cleanedUpAppUrl}: ${error.message}`)
    return res
  }
}
