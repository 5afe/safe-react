import { useState, useEffect, useCallback } from 'react'
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
  const [pinnedSafeAppIds, setPinnedSafeAppIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  const updatePinnedSafeApps = useCallback((newPinnedSafeAppIds: string[]) => {
    setPinnedSafeAppIds(newPinnedSafeAppIds)
    saveToStorage(PINNED_SAFE_APP_IDS, newPinnedSafeAppIds)
  }, [])

  useEffect(() => {
    const loadPinnedAppIds = async () => {
      const pinnedAppIds = (await loadFromStorage<string[]>(PINNED_SAFE_APP_IDS)) || []

      const isRemoteSafeAppsListLoaded = remoteAppsFetchStatus === FETCH_STATUS.SUCCESS
      if (isRemoteSafeAppsListLoaded) {
        // we remove pinned Safe Apps that are not included in the remote list, see #2847
        const filteredPinnedAppsIds = pinnedAppIds.filter((pinnedAppId) =>
          remoteSafeApps.map((app) => app.id).includes(pinnedAppId),
        )
        saveToStorage(PINNED_SAFE_APP_IDS, filteredPinnedAppsIds)
        setPinnedSafeAppIds(filteredPinnedAppsIds)
        setLoaded(true)
      }
    }

    loadPinnedAppIds()
  }, [remoteAppsFetchStatus, remoteSafeApps])

  return { pinnedSafeAppIds, loaded, updatePinnedSafeApps }
}

export { usePinnedSafeApps }
