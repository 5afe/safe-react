import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getEmptySafeApp } from '../utils'
import { AppData, fetchSafeAppsList } from 'src/logic/configService'
import { SafeApp, StoredSafeApp, SAFE_APP_FETCH_STATUS } from '../types'
import { getNetworkId } from 'src/config'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { NOTIFICATIONS } from 'src/logic/notifications'
import { useDispatch } from 'react-redux'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'

type UseAppListReturnType = {
  appList: SafeApp[]
  removeApp: (appUrl: string) => void
  isLoading: boolean
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])
  const [apiAppsList, setApiAppsList] = useState<AppData[]>([])
  const [customAppList, setCustomAppList] = useState<
    (StoredSafeApp & { disabled?: boolean; networks?: ETHEREUM_NETWORK[] })[]
  >([])
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAppsList = async () => {
      setIsLoading(true)
      try {
        const result = await fetchSafeAppsList()
        setApiAppsList(result && result?.length ? result : apiAppsList)
      } catch (e) {
        logError(Errors._902, e.message)
        dispatch(enqueueSnackbar(NOTIFICATIONS.SAFE_APPS_FETCH_ERROR_MSG))
      } finally {
        setIsLoading(false)
      }
    }

    if (!apiAppsList.length) {
      loadAppsList()
    }
  }, [dispatch, apiAppsList])

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
      let storageAppList =
        (await loadFromStorage<
          (StoredSafeApp & { disabled?: boolean; networks?: ETHEREUM_NETWORK[]; custom?: boolean })[]
        >(APPS_STORAGE_KEY)) || []
      storageAppList = storageAppList.map((app) => {
        app.custom = true
        return app
      })
      setCustomAppList(storageAppList)
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
              fetchAppCallback({ ...app, error: err.message })
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
        const newPersistedList = customAppList.filter(({ url }) => url !== appUrl)
        saveToStorage(APPS_STORAGE_KEY, newPersistedList)

        return newList
      })
    },
    [customAppList],
  )

  return {
    appList,
    removeApp,
    isLoading,
  }
}

export { useAppList }
