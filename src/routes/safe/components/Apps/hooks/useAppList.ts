import { useState, useEffect } from 'react'
import { loadFromStorage } from 'src/utils/storage'
import { APPS_STORAGE_KEY, getAppInfoFromUrl, getEmptySafeApp, staticAppsList } from '../utils'
import { SafeApp, StoredSafeApp, SAFE_APP_LOADING_STATUS } from '../types.d'
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
    const loadApps = async () => {
      // recover apps from storage:
      // * third-party apps added by the user
      // * disabled status for both static and third-party apps
      const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
      let list: (StoredSafeApp & { networks?: number[] })[] = [...persistedAppList]

      // merge stored apps with static apps (apps added manually can be deleted by the user)
      staticAppsList.forEach((staticApp) => {
        const app = list.find((persistedApp) => persistedApp.url === staticApp.url)
        if (app) {
          app.networks = staticApp.networks
        } else {
          list.push({ ...staticApp })
        }
      })

      // filter app by network
      list = list.filter((app) => {
        // if the app does not expose supported networks, include them. (backward compatible)
        if (!app.networks) {
          return true
        }
        return app.networks.includes(getNetworkId())
      })

      const apps: SafeApp[] = []
      for (let index = 0; index < list.length; index++) {
        const currentApp = list[index]
        const appUrl = currentApp.url.trim()

        const appInfo = {
          ...getEmptySafeApp(),
          url: appUrl,
        }

        apps.push(appInfo)
      }

      setAppList(apps)
    }

    if (!appList.length) {
      loadApps()
    }
  }, [appList])

  // fetch each safe-app
  // replace real data if it was success remove it from the list otherwise
  useEffect(() => {
    if (!appList?.length) {
      return
    }

    appList
      .filter((app) => app.loadingStatus === SAFE_APP_LOADING_STATUS.ADDED)
      .forEach((resApp) => {
        let cpApps = [...appList]
        const index = appList.findIndex((currentApp) => currentApp.url === resApp.url)
        cpApps[index] = { ...cpApps[index], loadingStatus: SAFE_APP_LOADING_STATUS.LOADING }
        setAppList(cpApps)

        getAppInfoFromUrl(resApp.url).then((res: SafeApp) => {
          if (res.error) {
            // if there was an error trying to load the safe-app, remove it from the list
            cpApps.splice(index, 1)
            throw Error(`There was a problem trying to load app ${res.url}`)
          } else {
            // if the safe app was loaded correctly, update the safe-app info
            cpApps[index] = res
          }
          cpApps = cpApps.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
          setAppList(cpApps)
        })
      })
  }, [appList])

  return {
    appList,
  }
}

export { useAppList }
