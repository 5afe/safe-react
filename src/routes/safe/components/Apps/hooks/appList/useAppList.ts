import { useState, useEffect, useCallback } from 'react'
import { getNetworkId } from 'src/config'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getAppInfoFromUrl, getEmptySafeApp } from '../../utils'
import { SafeApp, SAFE_APP_FETCH_STATUS } from '../../types'
import { useCustomSafeApps } from './useCustomSafeApps'
import { useRemoteSafeApps } from './useRemoteSafeApps'

type UseAppListReturnType = {
  appList: SafeApp[]
  removeApp: (appUrl: string) => void
  isLoading: boolean
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])
  const [apiAppsList, isLoading] = useRemoteSafeApps()
  const { customSafeApps, updateCustomSafeApps } = useCustomSafeApps()

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
      // backward compatibility. In a previous implementation a safe app could be disabled, that state was
      // persisted in the storage.
      const customApps = storageAppList.filter(
        (persistedApp) => !apiAppsList.some((app) => app.url === persistedApp.url),
      )
      const apps: SafeApp[] = [...apiAppsList, ...customApps]
        // if the app does not expose supported networks, include them. (backward compatible)
        .filter((app) => (!app.networks ? true : app.networks.includes(getNetworkId())))
        .map((app) => ({
          ...getEmptySafeApp(),
          ...app,
          url: app.url.trim(),
          custom: app.custom,
        }))
      setAppList(apps)

      apps.forEach((app) => {
        if (!app.name || app.name === 'unknown') {
          // We are using legacy mode, we have to fetch info from manifest
          getAppInfoFromUrl(app.url)
            .then((appFromUrl) => {
              const formatedApp = appFromUrl
              formatedApp.custom = app.custom
              fetchAppCallback(formatedApp)
            })
            .catch((err) => {
              logError(Errors._900, `${app.url}, ${err.message}`)
            })
        } else {
          // We already have manifest information so we directly add the app
          fetchAppCallback(app)
        }
      })
    }

    loadApps()
  }, [apiAppsList])

  const removeApp = useCallback(
    (appUrl: string): void => {
      setAppList((list) => {
        const newList = list.filter(({ url }) => url !== appUrl)
        const newPersistedList = customSafeApps.filter(({ url }) => url !== appUrl)
        updateCustomSafeApps(newPersistedList)

        return newList
      })
    },
    [updateCustomSafeApps, customSafeApps],
  )

  return {
    appList,
    removeApp,
    isLoading,
  }
}

export { useAppList }
