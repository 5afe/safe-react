import { useState, useEffect } from 'react'
import { loadFromStorage } from 'src/utils/storage'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getEmptySafeApp, staticAppsList } from '../utils'
import { SafeApp, StoredSafeApp, SAFE_APP_FETCH_STATUS } from '../types.d'
import { getNetworkId } from 'src/config'

type UseAppListReturnType = {
  appList: SafeApp[]
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])

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
          url: app.url.trim(),
        }))

      setAppList(apps)

      apps.forEach((app) => getAppInfoFromUrl(app.url).then(fetchAppCallback))
    }

    if (!appList.length) {
      loadApps()
    }
  }, [appList])

  return {
    appList,
  }
}

export { useAppList }
