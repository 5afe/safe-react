import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { PINNED_SAFE_APP_IDS } from '../../utils'

type ReturnType = {
  pinnedSafeAppIds: string[]
  loaded: boolean
  updatePinnedSafeApps: (newPinnedSafeAppIds: string[]) => void
}

const usePinnedSafeApps = (): ReturnType => {
  const [pinnedSafeAppIds, setPinnedSafeAppIds] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  const updatePinnedSafeApps = useCallback((newPinnedSafeAppIds: string[]) => {
    setPinnedSafeAppIds(newPinnedSafeAppIds)
    saveToStorage(PINNED_SAFE_APP_IDS, newPinnedSafeAppIds)
  }, [])

  useEffect(() => {
    const loadPinnedAppIds = async () => {
      const pinnedAppIds = (await loadFromStorage<string[]>(PINNED_SAFE_APP_IDS)) || []
      setPinnedSafeAppIds(pinnedAppIds)
      setLoaded(true)
    }

    loadPinnedAppIds()
  }, [])

  return { pinnedSafeAppIds, loaded, updatePinnedSafeApps }
}

export { usePinnedSafeApps }
