import { useState, useEffect } from 'react'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { getAppInfoFromUrl, getEmptySafeApp } from '../utils'
import { SafeApp } from '../types'

type UseSafeAppFromManifestReturnType = {
  safeApp: SafeApp
  isLoading: boolean
}

const useSafeAppFromManifest = (appUrl: string): UseSafeAppFromManifestReturnType => {
  const [safeApp, setSafeApp] = useState<SafeApp>(() => getEmptySafeApp(appUrl))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!appUrl) {
      return
    }

    const loadApp = async () => {
      setIsLoading(true)
      try {
        const app = await getAppInfoFromUrl(appUrl)
        setSafeApp(app)
      } catch (e) {
        logError(Errors._900, `${appUrl}, ${e.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadApp()
  }, [appUrl])

  return { safeApp, isLoading }
}

export { useSafeAppFromManifest }
