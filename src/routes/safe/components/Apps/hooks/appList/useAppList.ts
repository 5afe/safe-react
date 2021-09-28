import { useCallback, useMemo } from 'react'

import { SafeApp } from '../../types'
import { useCustomSafeApps } from './useCustomSafeApps'
import { useRemoteSafeApps } from './useRemoteSafeApps'
import { usePinnedSafeApps } from './usePinnedSafeApps'
import { FETCH_STATUS } from 'src/utils/requests'

type UseAppListReturnType = {
  appList: SafeApp[]
  pinnedSafeApps: SafeApp[]
  removeApp: (appUrl: string) => void
  isLoading: boolean
}

const useAppList = (): UseAppListReturnType => {
  const { remoteSafeApps, status: remoteAppsFetchStatus } = useRemoteSafeApps()
  const { customSafeApps, updateCustomSafeApps } = useCustomSafeApps()
  const { pinnedSafeAppIds } = usePinnedSafeApps()
  const remoteIsLoading = remoteAppsFetchStatus === FETCH_STATUS.LOADING

  const appList = useMemo(() => {
    // Filter out custom apps that are now part of the production app list
    const customApps = customSafeApps.filter(
      (persistedApp) => !remoteSafeApps.some((app) => app.url === persistedApp.url),
    )
    const apps: SafeApp[] = [...remoteSafeApps, ...customApps]

    return apps
      .filter((a) => a.fetchStatus !== FETCH_STATUS.ERROR)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [customSafeApps, remoteSafeApps])

  const pinnedSafeApps = useMemo(
    () => appList.filter((app) => pinnedSafeAppIds.includes(app.id)),
    [pinnedSafeAppIds, appList],
  )

  const removeApp = useCallback(
    (appUrl: string): void => {
      const newPersistedList = customSafeApps.filter(({ url }) => url !== appUrl)
      updateCustomSafeApps(newPersistedList)
    },
    [updateCustomSafeApps, customSafeApps],
  )

  return {
    appList,
    pinnedSafeApps,
    removeApp,
    isLoading: remoteIsLoading,
  }
}

export { useAppList }
