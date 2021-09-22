import { useState, useEffect } from 'react'
import { APPS_STORAGE_KEY } from '../../utils'
import { SafeApp } from '../../types'

type ReturnType = {
  customSafeApps: SafeApp[]
  loaded: boolean
}

const useCustomSafeApps = (): ReturnType => {
  const [customSafeApps, setCustomSafeApps] = useState<SafeApp[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadCustomApps = async () => {
      // recover apps from storage (third-party apps added by the user)
      let storageAppList =
        (await loadFromStorage<
          (StoredSafeApp & { disabled?: boolean; networks?: ETHEREUM_NETWORK[]; custom?: boolean })[]
        >(APPS_STORAGE_KEY)) || []
      storageAppList = storageAppList.map((app) => {
        app.custom = true
        return app
      })
      setCustomSafeApps(storageAppList)
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
  }, [])

  return { customSafeApps, loaded }
}

export { useCustomSafeApps }
