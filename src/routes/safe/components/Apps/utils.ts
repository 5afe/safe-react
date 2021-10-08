import axios from 'axios'
import memoize from 'lodash.memoize'

import { SafeApp, SAFE_APP_FETCH_STATUS } from './types'

import { getContentFromENS } from 'src/logic/wallets/getWeb3'
import appsIconSvg from 'src/assets/icons/apps.svg'

interface AppData {
  data?: {
    name: string
    iconPath: string
    description: string
    providedBy: string
    error?: string
  }
}

export const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

const removeLastTrailingSlash = (url: string): string => {
  return url.replace(/\/+$/, '')
}

export const getAppInfoFromOrigin = (origin: string): { url: string; name: string } | null => {
  try {
    return JSON.parse(origin)
  } catch (error) {
    console.error(`Impossible to parse TX from origin: ${origin}`)
    return null
  }
}

export const isAppManifestValid = (appInfo: AppData['data'] | SafeApp | undefined): boolean =>
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

export const getAppInfoFromUrl = memoize(async (appUrl: string): Promise<SafeApp> => {
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

  let appInfo: AppData | undefined
  try {
    appInfo = await axios.get(`${noTrailingSlashUrl}/manifest.json`, { timeout: 5_000 })
  } catch (error) {
    throw Error('Failed to fetch app manifest')
  }

  // verify imported app fulfill safe requirements
  if (!appInfo?.data || !isAppManifestValid(appInfo.data)) {
    throw Error('App manifest does not fulfill the required structure.')
  }

  // the DB origin field has a limit of 100 characters
  const originFieldSize = 200
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

  const concatenatedImgPath = `${noTrailingSlashUrl}/${appInfo.data.iconPath}`
  if (await canLoadAppImage(concatenatedImgPath)) {
    res.iconUrl = concatenatedImgPath
  }

  return res
})

export const getIpfsLinkFromEns = memoize(async (name: string): Promise<string | undefined> => {
  try {
    const content = await getContentFromENS(name)
    if (content && content.protocolType === 'ipfs') {
      return `${process.env.REACT_APP_IPFS_GATEWAY}/${content.decoded}/`
    }
  } catch (error) {
    console.error(error)
    return
  }
})

export const uniqueApp =
  (appList: SafeApp[]) =>
  (url: string): string | undefined => {
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

const canLoadAppImage = (path: string, timeout = 10000) =>
  new Promise(function (resolve) {
    try {
      const image = new Image()
      image.src = path
      image.addEventListener('load', () => resolve(true))
      image.addEventListener('error', () => resolve(false))

      setTimeout(() => resolve(false), timeout)
    } catch (err) {
      console.error(err)
      resolve(false)
    }
  })
