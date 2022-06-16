import { useState, useEffect, useCallback } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'

const APPS_SECURITY_STEPS_APPS_REVIEWED = 'APPS_SECURITY_STEPS_APPS_REVIEWED'
const APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED = 'APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED'
const APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED = 'APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED'
const APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED = 'APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED'

const useSecuritySteps = (): {
  appsReviewed: string[]
  onReviewApp: (appId: string) => void
  extendedListReviewed: boolean
  onReviewExtendedList: () => void
  customAppsReviewed: string[]
  onReviewCustomApp: (appUrl: string) => void
  onRemoveCustomApp: (appUrl: string) => void
  consentReceived: boolean
  onConsentReceipt: () => void
} => {
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)
  const [customAppsReviewed, setCustomAppsReviewed] = useState<string[]>([])
  const [consentReceived, setConsentReceived] = useState<boolean>(false)

  useEffect(() => {
    setAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_APPS_REVIEWED) || [])
    setExtendedListReviewed(loadFromStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED) || false)
    setCustomAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED) || [])
    setConsentReceived(loadFromStorage(APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED) || false)
  }, [])

  const onReviewApp = useCallback(
    (appId: string): void => {
      if (!appsReviewed.includes(appId)) {
        const reviewedApps = [...appsReviewed, appId]

        setAppsReviewed(reviewedApps)
        saveToStorage(APPS_SECURITY_STEPS_APPS_REVIEWED, reviewedApps)
      }
    },
    [appsReviewed],
  )

  const onReviewExtendedList = useCallback((): void => {
    setExtendedListReviewed(true)
    saveToStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED, true)
  }, [])

  const onReviewCustomApp = useCallback(
    (appUrl: string): void => {
      if (!customAppsReviewed.includes(appUrl)) {
        const reviewedApps = [...customAppsReviewed, appUrl]

        setCustomAppsReviewed(reviewedApps)
        saveToStorage(APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED, reviewedApps)
      }
    },
    [customAppsReviewed],
  )

  const onConsentReceipt = useCallback((): void => {
    setConsentReceived(true)
    saveToStorage(APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED, true)
  }, [])

  const onRemoveCustomApp = useCallback(
    (appUrl: string): void => {
      const reviewedApps = customAppsReviewed.filter((url) => url !== appUrl)
      setCustomAppsReviewed(reviewedApps)
      saveToStorage(APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED, reviewedApps)
    },
    [customAppsReviewed],
  )

  return {
    appsReviewed,
    onReviewApp,
    extendedListReviewed,
    onReviewExtendedList,
    customAppsReviewed,
    onReviewCustomApp,
    onRemoveCustomApp,
    consentReceived,
    onConsentReceipt,
  }
}

export { useSecuritySteps }
