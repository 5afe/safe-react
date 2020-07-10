import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { getAppInfoFromUrl, staticAppsList } from '../utils'
import { SafeApp, StoredSafeApp } from '../types'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

type onAppToggleHandler = (appId: string, enabled: boolean) => Promise<void>
type onAppAddedHandler = (app: SafeApp) => void

type UseAppListReturnType = {
  appList: SafeApp[]
  loadingAppList: boolean
  onAppToggle: onAppToggleHandler
  onAppAdded: onAppAddedHandler
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])
  const [loadingAppList, setLoadingAppList] = useState<boolean>(true)

  // Load apps list
  useEffect(() => {
    const loadApps = async () => {
      // recover apps from storage:
      // * third-party apps added by the user
      // * disabled status for both static and third-party apps
      const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
      const list = [...persistedAppList]

      staticAppsList.forEach((staticApp) => {
        if (!list.some((persistedApp) => persistedApp.url === staticApp.url)) {
          list.push(staticApp)
        }
      })

      const apps = []
      // using the appURL to recover app info
      for (let index = 0; index < list.length; index++) {
        try {
          const currentApp = list[index]

          const appInfo: any = await getAppInfoFromUrl(currentApp.url)
          if (appInfo.error) {
            throw Error(`There was a problem trying to load app ${currentApp.url}`)
          }

          appInfo.disabled = currentApp.disabled === undefined ? false : currentApp.disabled

          apps.push(appInfo)
        } catch (error) {
          console.error(error)
        }
      }

      setAppList(apps)
      setLoadingAppList(false)
      selectFirstApp(apps)
    }

    loadApps()
  }, [])

  const onAppToggle: onAppToggleHandler = useCallback(
    async (appId, enabled) => {
      // update in-memory list
      const copyAppList = [...appList]

      const app = copyAppList.find((a) => a.id === appId)
      if (!app) {
        return
      }

      app.disabled = !enabled
      setAppList(copyAppList)

      // update storage list
      const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
      let storageApp = persistedAppList.find((a) => a.url === app.url)

      if (!storageApp) {
        storageApp = { url: app.url }
        storageApp.disabled = !enabled
        persistedAppList.push(storageApp)
      } else {
        storageApp.disabled = !enabled
      }

      saveToStorage(APPS_STORAGE_KEY, persistedAppList)

      // select app
      if (!selectedApp || (selectedApp && selectedApp.id === appId)) {
        setSelectedAppId(undefined)
        selectFirstApp(copyAppList)
      }
    },
    [appList],
  )

  const onAppAdded: onAppAddedHandler = useCallback(
    (app) => {
      const newAppList = [
        { url: app.url, disabled: false },
        ...appList.map((a) => ({
          url: a.url,
          disabled: a.disabled,
        })),
      ]
      saveToStorage(APPS_STORAGE_KEY, newAppList)

      setAppList([...appList, { ...app, disabled: false }])
    },
    [appList],
  )

  return {
    appList,
    loadingAppList,
    onAppToggle,
    onAppAdded,
  }
}

export { useAppList }
