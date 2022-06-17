import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { useAppList } from './appList/useAppList'

const APPS_SECURITY_STEPS = 'APPS_SECURITY_STEPS'

type SecurityStepsStorage = {
  appsReviewed: string[]
  extendedListReviewed: boolean
  customAppsReviewed: string[]
  consentReceived: boolean
}

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
  const didMount = useRef(false)
  const { isLoading, appList, getSafeApp } = useAppList()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()

  useEffect(() => {
    const securityStepsStatus: SecurityStepsStorage = loadFromStorage(APPS_SECURITY_STEPS) || {
      appsReviewed: [],
      extendedListReviewed: false,
      customAppsReviewed: [],
      consentReceived: false,
    }

    if (securityStepsStatus) {
      setAppsReviewed(securityStepsStatus.appsReviewed)
      setExtendedListReviewed(securityStepsStatus.extendedListReviewed)
      setCustomAppsReviewed(securityStepsStatus.customAppsReviewed)
      setConsentReceived(securityStepsStatus.consentReceived)
    }
  }, [])

  useEffect(() => {
    if (!url) {
      setIsDisclaimerReadingCompleted(false)
    }
  }, [url])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    saveToStorage(APPS_SECURITY_STEPS, { appsReviewed, extendedListReviewed, customAppsReviewed, consentReceived })
  }, [appsReviewed, consentReceived, customAppsReviewed, extendedListReviewed])

  const onReviewApp = useCallback(
    (appId: string): void => {
      if (!appsReviewed.includes(appId)) {
        const reviewedApps = [...appsReviewed, appId]

        setAppsReviewed(reviewedApps)
      }
    },
    [appsReviewed],
  )

  const onReviewExtendedList = useCallback((): void => {
    setExtendedListReviewed(true)
  }, [])

  const onReviewCustomApp = useCallback(
    (appUrl: string): void => {
      if (!customAppsReviewed.includes(appUrl)) {
        const reviewedApps = [...customAppsReviewed, appUrl]

        setCustomAppsReviewed(reviewedApps)
      }
    },
    [customAppsReviewed],
  )

  const onConsentReceipt = useCallback((): void => {
    setConsentReceived(true)
  }, [])

  const onRemoveCustomApp = useCallback(
    (appUrl: string): void => {
      const reviewedApps = customAppsReviewed.filter((url) => url !== appUrl)
      setCustomAppsReviewed(reviewedApps)
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
      didMount.current &&
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
