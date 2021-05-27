import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getAppsList, getEmptySafeApp } from '../utils'
import { AppData } from '../api/fetchSafeAppsList'
import { SafeApp, StoredSafeApp, SAFE_APP_FETCH_STATUS } from '../types'
import { getNetworkId } from 'src/config'

type UseAppListReturnType = {
  appList: SafeApp[]
  removeApp: (appUrl: string) => void
  staticAppsList: AppData[]
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])
  const [staticAppsList, setStaticAppsList] = useState<AppData[]>([])

  useEffect(() => {
    const loadAppsList = async () => {
      const remoteAppsList = await getAppsList()
      setStaticAppsList(remoteAppsList)
    }

    if (!staticAppsList.length) {
      loadAppsList()
    }
  }, [staticAppsList])

  // Load apps list
  // for each URL we return a mocked safe-app with a loading status
  // it was developed to speed up initial page load, otherwise the
  // app renders a loading until all the safe-apps are fetched.
  useEffect(() => {
    const fetchAppCallback = (res: SafeApp) => {
      setAppList((prevStatus) => {
        const cpPrevStatus = [...prevStatus]
        const appIndex = cpPrevStatus.findIndex((a) => a.url === res.url)
        const newStatus = res.error ? SAFE_APP_FETCH_STATUS.ERROR : SAFE_APP_FETCH_STATUS.SUCCESS
        cpPrevStatus[appIndex] = { ...res, fetchStatus: newStatus }
        return cpPrevStatus.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      })
    }

    const loadApps = async () => {
      // recover apps from storage (third-party apps added by the user)
      const persistedAppList =
        (await loadFromStorage<(StoredSafeApp & { networks?: number[] })[]>(APPS_STORAGE_KEY)) || []

      // backward compatibility. In a previous implementation a safe app could be disabled, that state was
      // persisted in the storage.
      const customApps = persistedAppList.filter(
        (persistedApp) => !staticAppsList.some((staticApp) => staticApp.url === persistedApp.url),
      )

      const apps: SafeApp[] = [...staticAppsList, ...customApps]
        // if the app does not expose supported networks, include them. (backward compatible)
        .filter((app) => (!app.networks ? true : app.networks.includes(getNetworkId())))
        .map((app) => ({
          ...getEmptySafeApp(),
          ...app,
          url: app.url.trim(),
        }))

      setAppList(apps)

      apps.forEach((app) => {
        if (!app.name || app.name === 'unknown') {
          // We are using legacy mode, we have to fetch info from manifest
          getAppInfoFromUrl(app.url).then(fetchAppCallback)
        } else {
          // We already have manifest information so we directly add the app
          fetchAppCallback(app)
        }
      })
    }

    loadApps()
  }, [staticAppsList])

  const removeApp = useCallback((appUrl: string): void => {
    setAppList((list) => {
      const newList = list.filter(({ url }) => url !== appUrl)
      const persistedAppList = newList.map(({ url, disabled }) => ({ url, disabled }))
      saveToStorage(APPS_STORAGE_KEY, persistedAppList)

      return newList
    })
  }, [])

  return {
    appList,
    staticAppsList,
    removeApp,
  }
}

export { useAppList }
