import { useState, useEffect } from 'react'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { FETCH_STATUS } from 'src/utils/requests'
import { getAppInfoFromUrl, getEmptySafeApp } from '../utils'
import { SafeApp } from '../types'

type UseSafeAppManifestReturnType = {
  safeApp: SafeApp
  isLoading: boolean
}

const useSafeAppManifest = (appUrl: string): UseSafeAppManifestReturnType => {
  const [safeApp, setSafeApp] = useState<SafeApp>(() => getEmptySafeApp(appUrl))
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.NOT_ASKED)

  const isLoading = status === FETCH_STATUS.LOADING

  useEffect(() => {
    if (!appUrl) {
      return
    }

    const loadApp = async () => {
      setStatus(FETCH_STATUS.LOADING)
      try {
        const app = await getAppInfoFromUrl(appUrl)
        setSafeApp(app)
        setStatus(FETCH_STATUS.SUCCESS)
      } catch (e) {
        setStatus(FETCH_STATUS.ERROR)
        logError(Errors._900, `${appUrl}, ${e.message}`)
      }
    }

    loadApp()
  }, [appUrl])

  return { safeApp, isLoading }
}

export { useSafeAppManifest }
