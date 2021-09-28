import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { FETCH_STATUS } from 'src/utils/requests'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getEmptySafeApp } from '../../utils'
import { StoredSafeApp, SafeApp } from '../../types'

type ReturnType = {
  customSafeApps: SafeApp[]
  loaded: boolean
  updateCustomSafeApps: (newCustomSafeApps: SafeApp[]) => void
}

type CustomSafeApp = StoredSafeApp & { disabled?: boolean; networks?: ETHEREUM_NETWORK[]; custom: true }

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
    saveToStorage(APPS_STORAGE_KEY, newCustomSafeApps)
  }, [])

  useEffect(() => {
    const fetchAppCallback = (res: SafeApp, error = false) => {
      setCustomSafeApps((prev) => {
        const cpPrevStatus = [...prev]
        const appIndex = cpPrevStatus.findIndex((a) => a.url === res.url)
        const newStatus = error ? FETCH_STATUS.ERROR : FETCH_STATUS.SUCCESS
        cpPrevStatus[appIndex] = { ...res, fetchStatus: newStatus }
        return cpPrevStatus
      })
    }

    const loadCustomApps = async () => {
      // recover apps from storage (third-party apps added by the user)
      const storageAppList = (await loadFromStorage<CustomSafeApp[]>(APPS_STORAGE_KEY)) || []
      // if the app does not expose supported networks, include them. (backward compatible)
      const serializedApps = storageAppList
        .filter((app) => (!app.networks ? true : app.networks.includes(getNetworkId())))
        .map(
          (app): SafeApp => ({
            ...getEmptySafeApp(),
            ...app,
            url: app.url.trim(),
            custom: true,
          }),
        )
      setCustomSafeApps(serializedApps)
      setLoaded(true)

      serializedApps.forEach((app) => {
        if (!app.name || app.name === 'unknown') {
          // We are using legacy mode, we have to fetch info from manifest
          getAppInfoFromUrl(app.url)
            .then((appFromUrl) => {
              const formatedApp = appFromUrl
              formatedApp.custom = app.custom
              fetchAppCallback(formatedApp)
            })
            .catch((err) => {
              fetchAppCallback(app, true)
              logError(Errors._900, `${app.url}, ${err.message}`)
            })
        } else {
          // We already have manifest information so we directly add the app
          fetchAppCallback(app)
        }
      })
    }

    loadCustomApps()
  }, [])

  return { customSafeApps, loaded, updateCustomSafeApps }
}

export { useCustomSafeApps }
