import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { getAppInfoFromUrl, getEmptySafeApp, getAppsList } from '../utils'
import { SafeApp, StoredSafeApp, SAFE_APP_LOADING_STATUS } from '../types.d'
import { getNetworkId } from 'src/config'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

type onAppToggleHandler = (appId: string, enabled: boolean) => Promise<void>
type onAppAddedHandler = (app: SafeApp) => void
type onAppRemovedHandler = (appId: string) => void

type UseAppListReturnType = {
  appList: SafeApp[]
  onAppToggle: onAppToggleHandler
  onAppAdded: onAppAddedHandler
  onAppRemoved: onAppRemovedHandler
}

const useAppList = (): UseAppListReturnType => {
  const [appList, setAppList] = useState<SafeApp[]>([])

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
      let list: (StoredSafeApp & { isDeletable: boolean; networks?: number[] })[] = persistedAppList.map((a) => ({
        ...a,
        isDeletable: true,
      }))

      const staticAppsList = await getAppsList()

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

      const apps: SafeApp[] = []
      for (let index = 0; index < list.length; index++) {
        const currentApp = list[index]
        const appUrl = currentApp.url.trim()

        const appInfo = {
          ...getEmptySafeApp(),
          url: appUrl,
        }

        appInfo.disabled = Boolean(currentApp.disabled)
        appInfo.isDeletable = Boolean(currentApp.isDeletable) === undefined ? true : currentApp.isDeletable

        apps.push(appInfo)
      }

      setAppList(apps)
    }

    if (!appList.length) {
      loadApps().catch((error) => {
        console.log({ error })
        throw error
      })
    }
  }, [appList])

  // fetch each safe-app
  // replace real data if it was success, remove it from the list otherwise
  useEffect(() => {
    const updateSafeApp = (res: SafeApp) => {
      setAppList((prevAppList) => {
        const cpAppList = [...prevAppList]
        const index = cpAppList.findIndex((currentApp) => currentApp.url === res.url)
        const app = cpAppList[index]

        cpAppList[index] = res.error
          ? { ...app, loadingStatus: SAFE_APP_LOADING_STATUS.ERROR }
          : { ...app, ...res, loadingStatus: SAFE_APP_LOADING_STATUS.SUCCESS }

        return cpAppList
      })
    }

    const getAppInfo = (filteredAppList: SafeApp[]) => {
      filteredAppList.forEach((app) => {
        const index = filteredAppList.findIndex((currentApp) => currentApp.url === app.url)
        filteredAppList[index] = { ...filteredAppList[index], loadingStatus: SAFE_APP_LOADING_STATUS.LOADING }

        getAppInfoFromUrl(app.url).then(updateSafeApp)
      })

      setAppList(filteredAppList)
    }

    const filteredAppList = appList.filter((app) => app.loadingStatus === SAFE_APP_LOADING_STATUS.ADDED)
    if (!filteredAppList.length) {
      return
    }
    getAppInfo(filteredAppList)
  }, [appList])

  return {
    appList,
    onAppToggle,
    onAppAdded,
    onAppRemoved,
  }
}

export { useAppList }
