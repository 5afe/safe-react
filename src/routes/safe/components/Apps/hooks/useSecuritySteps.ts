import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_SECURITY_STEPS_REVIEWED = 'APPS_SECURITY_STEPS_REVIEWED'

const useSecuritySteps = (): { appsReviewed: string[]; onReviewApp: (appId: string) => void } => {
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])

  useEffect(() => {
    setAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_REVIEWED) || [])
  }, [])

  const onReviewApp = useCallback(
    (appId: string): void => {
      setAppsReviewed([...appsReviewed, appId])
      saveToStorage(APPS_SECURITY_STEPS_REVIEWED, true)
    },
    [appsReviewed],
  )

  return { appsReviewed, onReviewApp }
}

export { useSecuritySteps }
