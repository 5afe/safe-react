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
    }

    loadApps()
  }, [])

  const onAppToggle: onAppToggleHandler = useCallback(
    async (appId, enabled) => {
      // update in-memory list
      const appListCopy = [...appList]

      const app = appListCopy.find((a) => a.id === appId)
      if (!app) {
        return
      }

      app.disabled = !enabled
      setAppList(appListCopy)

      // update storage list
      const listToPersist: StoredSafeApp[] = appListCopy.map(({ url, disabled }) => ({ url, disabled }))
      saveToStorage(APPS_STORAGE_KEY, listToPersist)
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
