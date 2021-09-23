import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { APPS_STORAGE_KEY } from '../../utils'
import { StoredSafeApp } from '../../types'

type ReturnType = {
  customSafeApps: CustomSafeApp[]
  loaded: boolean
  updateCustomSafeApps: (newCustomSafeApps: CustomSafeApp[]) => void
}

type CustomSafeApp = StoredSafeApp & { disabled?: boolean; networks?: ETHEREUM_NETWORK[]; custom: true }

const useCustomSafeApps = (): ReturnType => {
  const [customSafeApps, setCustomSafeApps] = useState<CustomSafeApp[]>([])
  const [loaded, setLoaded] = useState(false)

  const updateCustomSafeApps = useCallback((newCustomSafeApps: CustomSafeApp[]) => {
    setCustomSafeApps(newCustomSafeApps)
    saveToStorage(APPS_STORAGE_KEY, newCustomSafeApps)
  }, [])

  useEffect(() => {
    const loadCustomApps = async () => {
      // recover apps from storage (third-party apps added by the user)
      let storageAppList = (await loadFromStorage<CustomSafeApp[]>(APPS_STORAGE_KEY)) || []
      storageAppList = storageAppList.map((app) => {
        app.custom = true
        return app
      })
      setCustomSafeApps(storageAppList)
      setLoaded(true)
    }

    loadCustomApps()
  }, [])

  return { customSafeApps, loaded, updateCustomSafeApps }
}

export { useCustomSafeApps }
