import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { useAppList } from './appList/useAppList'

const APPS_SECURITY_STEPS_APPS_REVIEWED = 'APPS_SECURITY_STEPS_APPS_REVIEWED'
const APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED = 'APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED'
const APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED = 'APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED'
const APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED = 'APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED'

const useSecuritySteps = (): {
  handleConfirm: (shouldHide: boolean) => void
  showDisclaimer: boolean
  consentReceived: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  extendedListReviewed: boolean
  onRemoveCustomApp: (appUrl: string) => void
} => {
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)
  const [customAppsReviewed, setCustomAppsReviewed] = useState<string[]>([])
  const [consentReceived, setConsentReceived] = useState<boolean>(false)
  const [isDisclaimerReadingCompleted, setIsDisclaimerReadingCompleted] = useState(false)
  const { isLoading, appList, getSafeApp } = useAppList()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()

  useEffect(() => {
    setAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_APPS_REVIEWED) || [])
    setExtendedListReviewed(loadFromStorage(APPS_SECURITY_STEPS_EXTENDED_LIST_REVIEWED) || false)
    setCustomAppsReviewed(loadFromStorage(APPS_SECURITY_STEPS_CUSTOM_APPS_REVIEWED) || [])
    setConsentReceived(loadFromStorage(APPS_SECURITY_STEPS_LEGAL_CONSENT_REVIEWED) || false)
  }, [])

  useEffect(() => {
    if (!url) {
      setIsDisclaimerReadingCompleted(false)
    }
  }, [url])

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

  const isSafeAppInDefaultList = useMemo(() => {
    if (!url) return false

    const urlInstance = new URL(url)
    const safeAppUrl = `${urlInstance.hostname}/${urlInstance.pathname}`

    return appList.some((appItem) => {
      const appItemUrl = new URL(appItem.url)
      return `${appItemUrl.hostname}/${appItemUrl.pathname}` === safeAppUrl
    })
  }, [appList, url])

  const isFirstTimeAccessingApp = useMemo(() => {
    if (!url) return true

    const safeAppId = getSafeApp(url)?.id

    return safeAppId ? !appsReviewed?.includes(safeAppId) : !customAppsReviewed?.includes(url)
  }, [appsReviewed, customAppsReviewed, getSafeApp, url])

  const handleConfirm = useCallback(
    (shouldHide: boolean) => {
      onConsentReceipt()

      const safeAppId = getSafeApp(url)?.id

      if (safeAppId) {
        onReviewApp(safeAppId)
      } else {
        if (shouldHide) {
          onReviewCustomApp(url)
        }
      }

      if (!extendedListReviewed) {
        onReviewExtendedList()
      }

      setIsDisclaimerReadingCompleted(true)
    },
    [extendedListReviewed, getSafeApp, onConsentReceipt, onReviewApp, onReviewCustomApp, onReviewExtendedList, url],
  )

  const showDisclaimer = useMemo(
    () =>
      !isLoading &&
      (!consentReceived ||
        (isSafeAppInDefaultList && isFirstTimeAccessingApp) ||
        (!isSafeAppInDefaultList && isFirstTimeAccessingApp && !isDisclaimerReadingCompleted)),
    [consentReceived, isDisclaimerReadingCompleted, isFirstTimeAccessingApp, isLoading, isSafeAppInDefaultList],
  )

  return {
    handleConfirm,
    showDisclaimer,
    consentReceived,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    extendedListReviewed,
    onRemoveCustomApp,
  }
}

export { useSecuritySteps }
