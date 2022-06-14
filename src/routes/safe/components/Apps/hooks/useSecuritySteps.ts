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
      if (!appsReviewed.includes(appId)) {
        const reviewedApps = [...appsReviewed, appId]

        setAppsReviewed(reviewedApps)
        saveToStorage(APPS_SECURITY_STEPS_REVIEWED, reviewedApps)
      }
    },
    [appsReviewed],
  )

  return { appsReviewed, onReviewApp }
}

export { useSecuritySteps }
