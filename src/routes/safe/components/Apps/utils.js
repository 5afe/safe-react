// @flow
import axios from 'axios'

import appsIconSvg from '~/routes/safe/components/Transactions/TxsTable/TxType/assets/appsIcon.svg'

export const GNOSIS_APPS_URL = 'https://gnosis-apps.netlify.com'

const appsUrl = process.env.REACT_APP_GNOSIS_APPS_URL ? process.env.REACT_APP_GNOSIS_APPS_URL : GNOSIS_APPS_URL
export const staticAppsList = [`${appsUrl}/compound`]

export const getAppInfoFromOrigin = (origin: string) => {
  try {
    return JSON.parse(origin)
  } catch (error) {
    console.error(`Impossible to parse TX origin: ${origin}`)
    return null
  }
}

export const getAppInfoFromUrl = async (appUrl: string) => {
  try {
    const appInfo = await axios.get(`${appUrl}/manifest.json`)
    const res = { url: appUrl, ...appInfo.data, iconUrl: appsIconSvg }
    if (appInfo.data.iconPath) {
      try {
        const iconInfo = await axios.get(`${appUrl}/${appInfo.data.iconPath}`)
        if (/image\/\w/gm.test(iconInfo.headers['content-type'])) {
          res.iconUrl = `${appUrl}/${appInfo.data.iconPath}`
        }
      } catch (error) {
        console.error(`It was not possible to fetch icon from app ${res.name}`)
      }
    }
    return res
  } catch (error) {
    console.error(`It was not possible to fetch app from ${appUrl}`)
    return null
  }
}
