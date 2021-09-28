import { useCallback, useMemo } from 'react'

import { SafeApp } from '../../types'
import { useCustomSafeApps } from './useCustomSafeApps'
import { useRemoteSafeApps } from './useRemoteSafeApps'
import { usePinnedSafeApps } from './usePinnedSafeApps'
import { FETCH_STATUS } from 'src/utils/requests'

type UseAppListReturnType = {
  appList: SafeApp[]
  removeApp: (appUrl: string) => void
  isLoading: boolean
}

const useAppList = (): UseAppListReturnType => {
  const { remoteSafeApps, status: remoteAppsFetchStatus } = useRemoteSafeApps()
  const { customSafeApps, updateCustomSafeApps } = useCustomSafeApps()
  const { pinnedSafeAppIds } = usePinnedSafeApps()
  const remoteIsLoading = remoteAppsFetchStatus === FETCH_STATUS.LOADING

  const appList = useMemo(() => {
    const customApps = customSafeApps.filter(
      (persistedApp) => !remoteSafeApps.some((app) => app.url === persistedApp.url),
    )
    const apps: SafeApp[] = [...remoteSafeApps, ...customApps]

    return apps
      .filter((a) => a.fetchStatus !== FETCH_STATUS.ERROR)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [customSafeApps, remoteSafeApps])

  const removeApp = useCallback(
    (appUrl: string): void => {
      const newPersistedList = customSafeApps.filter(({ url }) => url !== appUrl)
      updateCustomSafeApps(newPersistedList)
    },
    [updateCustomSafeApps, customSafeApps],
  )

  return {
    appList,
    removeApp,
    isLoading: remoteIsLoading,
  }
}

export { useAppList }
