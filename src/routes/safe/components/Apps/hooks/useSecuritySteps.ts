import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_SECURITY_STEPS_REVIEWED = 'APPS_SECURITY_STEPS_REVIEWED'
const APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED = 'APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED'

const useSecuritySteps = (): {
  appsReviewed: string[]
  onReviewApp: (appId: string) => void
  extendedListReviewed: boolean
  onReviewExtendedList: () => void
} => {
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)

  useEffect(() => {
    setAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_REVIEWED) || [])
    setExtendedListReviewed(loadFromStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED) || false)
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

  const onReviewExtendedList = useCallback((): void => {
    setExtendedListReviewed(true)
    saveToStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED, true)
  }, [])

  return { appsReviewed, onReviewApp, extendedListReviewed, onReviewExtendedList }
}

export { useSecuritySteps }
