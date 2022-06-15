import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_SECURITY_STEPS_REVIEWED = 'APPS_SECURITY_STEPS_REVIEWED'
const APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED = 'APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED'
const APPS_SECURITY_STEPS_CUSTOM_WARNING = 'APPS_SECURITY_STEPS_CUSTOM_WARNING'
const APPS_SECURITY_STEPS_LEGAL_CONSENT_RECEIVED = 'APPS_SECURITY_STEPS_LEGAL_CONSENT_RECEIVED'

const useSecuritySteps = (): {
  appsReviewed: string[]
  onReviewApp: (appId: string) => void
  extendedListReviewed: boolean
  onReviewExtendedList: () => void
  hideCustomAppsWarning: boolean
  onHideCustomAppsWarning: () => void
  consentReceived: boolean
  onConsentReceipt: () => void
} => {
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)
  const [hideCustomAppsWarning, setHideCustomAppsWarning] = useState(false)
  const [consentReceived, setConsentReceived] = useState<boolean>(false)

  useEffect(() => {
    setAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_REVIEWED) || [])
    setExtendedListReviewed(loadFromStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED) || false)
    setHideCustomAppsWarning(loadFromStorage(APPS_SECURITY_STEPS_CUSTOM_WARNING) || false)
    setConsentReceived(loadFromStorage(APPS_SECURITY_STEPS_LEGAL_CONSENT_RECEIVED) || false)
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

  const onHideCustomAppsWarning = useCallback((): void => {
    setHideCustomAppsWarning(true)
    saveToStorage(APPS_SECURITY_STEPS_CUSTOM_WARNING, true)
  }, [])

  const onConsentReceipt = useCallback((): void => {
    setConsentReceived(true)
    saveToStorage(APPS_SECURITY_STEPS_LEGAL_CONSENT_RECEIVED, true)
  }, [])

  return {
    appsReviewed,
    onReviewApp,
    hideCustomAppsWarning,
    extendedListReviewed,
    onReviewExtendedList,
    onHideCustomAppsWarning,
    consentReceived,
    onConsentReceipt,
  }
}

export { useSecuritySteps }
