import { useCallback, useMemo } from 'react'

import { SafeApp } from '../../types'
import { useCustomSafeApps } from './useCustomSafeApps'
import { useRemoteSafeApps } from './useRemoteSafeApps'
import { usePinnedSafeApps } from './usePinnedSafeApps'
import { FETCH_STATUS } from 'src/utils/requests'

type UseAppListReturnType = {
  allApps: SafeApp[]
  appList: SafeApp[]
  customApps: SafeApp[]
  pinnedSafeApps: SafeApp[]
  togglePin: (appId: string) => void
  removeApp: (appId: string) => void
  addCustomApp: (app: SafeApp) => void
  isLoading: boolean
}

const useAppList = (): UseAppListReturnType => {
  const { remoteSafeApps, status: remoteAppsFetchStatus } = useRemoteSafeApps()
  const { customSafeApps, updateCustomSafeApps } = useCustomSafeApps()
  const { pinnedSafeAppIds, updatePinnedSafeApps } = usePinnedSafeApps()
  const remoteIsLoading = remoteAppsFetchStatus === FETCH_STATUS.LOADING

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
    (appId: string): void => {
      const newPersistedList = customSafeApps.filter(({ id }) => id !== appId)
      updateCustomSafeApps(newPersistedList)
    },
    [updateCustomSafeApps, customSafeApps],
  )

  const togglePin = useCallback(
    (appId: string): void => {
      const newPinnedIds = [...pinnedSafeAppIds]

      if (pinnedSafeAppIds.includes(appId)) {
        newPinnedIds.splice(newPinnedIds.indexOf(appId), 1)
      } else {
        newPinnedIds.push(appId)
      }

      updatePinnedSafeApps(newPinnedIds)
    },
    [updatePinnedSafeApps, pinnedSafeAppIds],
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
  }
}

export { useAppList }
