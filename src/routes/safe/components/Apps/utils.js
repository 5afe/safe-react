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
  let res = { url: appUrl, name: 'unknown', iconUrl: appsIconSvg, error: true }

  try {
    const appInfo = await axios.get(`${appUrl}/manifest.json`)

    // verify imported app fulfil safe requirements
    if (
      !appInfo ||
      !appInfo.data ||
      !appInfo.data.name ||
      !appInfo.data.description ||
      !appInfo.data.providedBy ||
      !appInfo.data.providedBy.name ||
      !appInfo.data.providedBy.url
    ) {
      throw Error()
    }

    res = { ...res, ...appInfo.data, error: false }
    if (appInfo.data.iconPath) {
      try {
        const iconInfo = await axios.get(`${appUrl}/${appInfo.data.iconPath}`)
        if (/image\/\w/gm.test(iconInfo.headers['content-type'])) {
          res.iconUrl = `${appUrl}/${appInfo.data.iconPath}`
        }
      } catch (error) {
        console.error(`It was not possible to fetch icon from app ${appUrl}`)
      }
    }
    return res
  } catch (error) {
    console.error(`It was not possible to fetch app from ${appUrl}`)
    return res
  }
}
