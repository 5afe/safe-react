import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { getAppInfoFromUrl, staticAppsList } from '../utils'
import { SafeApp, StoredSafeApp } from '../types'
import { getNetworkId } from 'src/config'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

type onAppToggleHandler = (appId: string, enabled: boolean) => Promise<void>
type onAppAddedHandler = (app: SafeApp) => void
type onAppRemovedHandler = (appId: string) => void

type UseAppListReturnType = {
  appList: SafeApp[]
  loadingAppList: boolean
  onAppToggle: onAppToggleHandler
  onAppAdded: onAppAddedHandler
  onAppRemoved: onAppRemovedHandler
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
      let list: (StoredSafeApp & { isDeletable: boolean; networks?: number[] })[] = persistedAppList.map((a) => ({
        ...a,
        isDeletable: true,
      }))

      // merge stored apps with static apps (apps added manually can be deleted by the user)
      staticAppsList.forEach((staticApp) => {
        const app = list.find((persistedApp) => persistedApp.url === staticApp.url)
        if (app) {
          app.isDeletable = false
          app.networks = staticApp.networks
        } else {
          list.push({ ...staticApp, isDeletable: false })
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

      let apps: SafeApp[] = []
      // using the appURL to recover app info
      for (let index = 0; index < list.length; index++) {
        try {
          const currentApp = list[index]

          const appInfo: SafeApp = await getAppInfoFromUrl(currentApp.url)
          if (appInfo.error) {
            throw Error(`There was a problem trying to load app ${currentApp.url}`)
          }

          appInfo.disabled = Boolean(currentApp.disabled)
          appInfo.isDeletable = Boolean(currentApp.isDeletable) === undefined ? true : currentApp.isDeletable

          apps.push(appInfo)
        } catch (error) {
          console.error(error)
        }
      }
      apps = apps.sort((a, b) => a.name.localeCompare(b.name))

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

      setAppList([...appList, { ...app, isDeletable: true }])
    },
    [appList],
  )

  const onAppRemoved: onAppRemovedHandler = useCallback(
    (appId) => {
      const appListCopy = appList.filter((a) => a.id !== appId)

      setAppList(appListCopy)

      const listToPersist: StoredSafeApp[] = appListCopy.map(({ url, disabled }) => ({ url, disabled }))
      saveToStorage(APPS_STORAGE_KEY, listToPersist)
    },
    [appList],
  )

  return {
    appList,
    loadingAppList,
    onAppToggle,
    onAppAdded,
    onAppRemoved,
  }
}

export { useAppList }
