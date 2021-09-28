import { useState, useEffect, useCallback, useMemo } from 'react'
import { getNetworkId } from 'src/config'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getAppInfoFromUrl, getEmptySafeApp } from '../../utils'
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
  const { customSafeApps, updateCustomSafeApps, loaded: customAppsLoaded } = useCustomSafeApps()
  const { pinnedSafeAppIds } = usePinnedSafeApps()
  const remoteIsLoading = remoteAppsFetchStatus === FETCH_STATUS.LOADING

  const appList = useMemo(() => {
    const customApps = customSafeApps.filter(
      (persistedApp) => !remoteSafeApps.some((app) => app.url === persistedApp.url),
    )
    const apps: SafeApp[] = [...remoteSafeApps, ...customApps]

    return apps.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }, [customSafeApps])

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
