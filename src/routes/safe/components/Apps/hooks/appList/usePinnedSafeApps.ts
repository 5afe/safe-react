import { useState, useEffect } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { PINNED_SAFE_APP_IDS } from '../../utils'
import { FETCH_STATUS } from 'src/utils/requests'
import { SafeApp } from '../../types'

type ReturnType = {
  pinnedSafeAppIds: string[]
  loaded: boolean
  updatePinnedSafeApps: (newPinnedSafeAppIds: string[]) => void
}

const usePinnedSafeApps = (remoteSafeApps: SafeApp[], remoteAppsFetchStatus: FETCH_STATUS): ReturnType => {
  const [pinnedSafeAppIds, updatePinnedSafeApps] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const loadPinnedAppIds = () => {
      const pinnedAppIds = loadFromStorage<string[]>(PINNED_SAFE_APP_IDS) || []

      const isRemoteSafeAppsListLoaded = remoteAppsFetchStatus === FETCH_STATUS.SUCCESS
      if (isRemoteSafeAppsListLoaded) {
        // we remove pinned Safe Apps that are not included in the remote list, see #2847
        const filteredPinnedAppsIds = pinnedAppIds.filter((pinnedAppId) =>
          remoteSafeApps.some((app) => app.id === pinnedAppId),
        )
        updatePinnedSafeApps(filteredPinnedAppsIds)
        setLoaded(true)
      }
    }

    loadPinnedAppIds()
  }, [remoteAppsFetchStatus, remoteSafeApps])

  // we only update pinned apps in the localStorage when remote Apps are loaded
  useEffect(() => {
    const isRemoteSafeAppsListLoaded = remoteAppsFetchStatus === FETCH_STATUS.SUCCESS
    if (isRemoteSafeAppsListLoaded) {
      saveToStorage(PINNED_SAFE_APP_IDS, pinnedSafeAppIds)
    }
  }, [pinnedSafeAppIds, remoteAppsFetchStatus])

  return { pinnedSafeAppIds, loaded, updatePinnedSafeApps }
}

export { usePinnedSafeApps }
