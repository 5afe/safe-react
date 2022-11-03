import { useCallback, useMemo } from 'react'

import { SafeApp } from '../../types'
import { useCustomSafeApps } from './useCustomSafeApps'
import { useRemoteSafeApps } from './useRemoteSafeApps'
import { usePinnedSafeApps } from './usePinnedSafeApps'
import { FETCH_STATUS } from 'src/utils/requests'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_APPS_EVENTS } from 'src/utils/events/safeApps'
import { isSameUrl } from '../../utils'
import { useBrowserPermissions, useSafePermissions } from '../permissions'

type UseAppListReturnType = {
  allApps: SafeApp[]
  appList: SafeApp[]
  customApps: SafeApp[]
  pinnedSafeApps: SafeApp[]
  togglePin: (app: SafeApp) => void
  removeApp: (appId: string, url: string) => void
  addCustomApp: (app: SafeApp) => void
  isLoading: boolean
  getSafeApp: (url: string) => SafeApp | undefined
}

const useAppList = (): UseAppListReturnType => {
  const { remoteSafeApps, status: remoteAppsFetchStatus } = useRemoteSafeApps()
  const { customSafeApps, updateCustomSafeApps } = useCustomSafeApps()
  const { pinnedSafeAppIds, updatePinnedSafeApps } = usePinnedSafeApps(remoteSafeApps, remoteAppsFetchStatus)
  const remoteIsLoading = remoteAppsFetchStatus === FETCH_STATUS.LOADING
  const { removePermissions: removeSafePermissions } = useSafePermissions()
  const { removePermissions: removeBrowserPermissions } = useBrowserPermissions()

  const allApps = useMemo(() => {
    const allApps = [...remoteSafeApps, ...customSafeApps]
    return allApps.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [remoteSafeApps, customSafeApps])

  const appList = useMemo(() => {
    return remoteSafeApps.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [remoteSafeApps])

  const customApps = useMemo(
    () =>
      // Filter out custom apps that are now part of the production app list
      customSafeApps
        .filter((persistedApp) => !remoteSafeApps.some((app) => app.url === persistedApp.url))
        .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    [customSafeApps, remoteSafeApps],
  )

  const pinnedSafeApps = useMemo(
    () => appList.filter((app) => pinnedSafeAppIds.includes(app.id)),
    [pinnedSafeAppIds, appList],
  )

  const addCustomApp = useCallback(
    (app: SafeApp): void => {
      const newList = [...customSafeApps, app]
      updateCustomSafeApps(newList)
    },
    [updateCustomSafeApps, customSafeApps],
  )

  const removeApp = useCallback(
    (appId: string, url: string): void => {
      const newPersistedList = customSafeApps.filter(({ id }) => id !== appId)
      removeSafePermissions(url)
      removeBrowserPermissions(url)
      updateCustomSafeApps(newPersistedList)
    },
    [customSafeApps, removeSafePermissions, removeBrowserPermissions, updateCustomSafeApps],
  )

  const togglePin = useCallback(
    (app: SafeApp): void => {
      const { id: appId, name: appName } = app
      const newPinnedIds = [...pinnedSafeAppIds]
      const isAppPinned = pinnedSafeAppIds.includes(appId)

      if (isAppPinned) {
        trackEvent({ ...SAFE_APPS_EVENTS.UNPIN, label: appName })
        newPinnedIds.splice(newPinnedIds.indexOf(appId), 1)
      } else {
        trackEvent({ ...SAFE_APPS_EVENTS.PIN, label: appName })
        newPinnedIds.push(appId)
      }

      updatePinnedSafeApps(newPinnedIds)
    },
    [updatePinnedSafeApps, pinnedSafeAppIds],
  )

  const getSafeApp = useCallback(
    (url: string): SafeApp | undefined => {
      if (!url) return

      const urlInstance = new URL(url)
      const safeAppUrl = `${urlInstance.hostname}/${urlInstance.pathname}`

      return appList.find((app: SafeApp) => {
        const appUrlInstance = new URL(app?.url)

        if (isSameUrl(`${appUrlInstance?.hostname}/${appUrlInstance?.pathname}`, safeAppUrl)) {
          return app
        }
      })
    },
    [appList],
  )

  return {
    allApps,
    appList,
    customApps,
    pinnedSafeApps,
    removeApp,
    togglePin,
    addCustomApp,
    isLoading: remoteIsLoading,
    getSafeApp,
  }
}

export { useAppList }
