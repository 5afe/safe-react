import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { FETCH_STATUS } from 'src/utils/requests'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getEmptySafeApp } from '../../utils'
import { StoredSafeApp, SafeApp } from '../../types'

type ReturnType = {
  customSafeApps: SafeApp[]
  loaded: boolean
  updateCustomSafeApps: (newCustomSafeApps: SafeApp[]) => void
}

type CustomSafeApp = StoredSafeApp

/*
  This hook is used to manage the list of custom safe apps.
  What it does:
  1. Loads a list of custom safe apps from local storage
  2. Does some backward compatibility checks (supported app networks, etc)
  3. Tries to fetch the app info (manifest.json) from the app url
*/
const useCustomSafeApps = (): ReturnType => {
  const [customSafeApps, setCustomSafeApps] = useState<SafeApp[]>([])
  const [loaded, setLoaded] = useState(false)

  const updateCustomSafeApps = useCallback((newCustomSafeApps: SafeApp[]) => {
    setCustomSafeApps(newCustomSafeApps)
    saveToStorage(
      APPS_STORAGE_KEY,
      newCustomSafeApps.map(({ url }) => ({ url })),
    )
  }, [])

  useEffect(() => {
    const fetchAppCallback = (res: SafeApp, error = false) => {
      setCustomSafeApps((prev) => {
        const prevAppsCopy = [...prev]
        const appIndex = prevAppsCopy.findIndex((a) => a.url === res.url)

        if (error) {
          prevAppsCopy.splice(appIndex, 1)
        } else {
          prevAppsCopy[appIndex] = { ...res, fetchStatus: FETCH_STATUS.SUCCESS }
        }

        return prevAppsCopy
      })
    }

    const loadCustomApps = () => {
      // recover apps from storage (third-party apps added by the user)
      const storageAppList = loadFromStorage<CustomSafeApp[]>(APPS_STORAGE_KEY) || []
      // if the app does not expose supported networks, include them. (backward compatible)
      const serializedApps = storageAppList.map(
        (app): SafeApp => ({
          ...getEmptySafeApp(),
          ...app,
          url: app.url.trim(),
          id: app.url.trim(),
          custom: true,
        }),
      )
      setCustomSafeApps(serializedApps)
      setLoaded(true)

      serializedApps.forEach((app) => {
        getAppInfoFromUrl(app.url)
          .then((appFromUrl) => {
            fetchAppCallback({ ...appFromUrl, custom: true })
          })
          .catch((err) => {
            fetchAppCallback(app, true)
            logError(Errors._900, `${app.url}, ${err.message}`)
          })
      })
    }

    loadCustomApps()
  }, [])

  return { customSafeApps, loaded, updateCustomSafeApps }
}

export { useCustomSafeApps }
