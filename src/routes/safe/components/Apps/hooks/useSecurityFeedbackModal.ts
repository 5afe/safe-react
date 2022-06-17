import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'

const APPS_SECURITY_FEEDBACK_MODAL = 'APPS_SECURITY_FEEDBACK_MODAL'

type SecurityFeedbackModalStorage = {
  appsReviewed: string[]
  extendedListReviewed: boolean
  customAppsReviewed: string[]
  consentReceived: boolean
}

const useSecurityFeedbackModal = (): {
  handleConfirm: (shouldHide: boolean) => void
  showDisclaimer: boolean
  consentReceived: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  extendedListReviewed: boolean
  onRemoveCustomApp: (appUrl: string) => void
} => {
  const didMount = useRef(false)

  const { isLoading, appList, getSafeApp } = useAppList()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()

  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)
  const [customAppsReviewed, setCustomAppsReviewed] = useState<string[]>([])
  const [consentReceived, setConsentReceived] = useState<boolean>(false)
  const [isDisclaimerReadingCompleted, setIsDisclaimerReadingCompleted] = useState(false)

  useEffect(() => {
    const securityStepsStatus: SecurityFeedbackModalStorage = loadFromStorage(APPS_SECURITY_FEEDBACK_MODAL) || {
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

    saveToStorage(APPS_SECURITY_FEEDBACK_MODAL, {
      appsReviewed,
      extendedListReviewed,
      customAppsReviewed,
      consentReceived,
    })
  }, [appsReviewed, consentReceived, customAppsReviewed, extendedListReviewed])

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
      setConsentReceived(true)

      const safeAppId = getSafeApp(url)?.id

      if (safeAppId && !appsReviewed.includes(safeAppId)) {
        const reviewedApps = [...appsReviewed, safeAppId]

        setAppsReviewed(reviewedApps)
      } else {
        if (shouldHide && !customAppsReviewed.includes(url)) {
          const reviewedApps = [...customAppsReviewed, url]

          setCustomAppsReviewed(reviewedApps)
        }
      }

      if (!extendedListReviewed) {
        setExtendedListReviewed(true)
      }

      setIsDisclaimerReadingCompleted(true)
    },
    [appsReviewed, customAppsReviewed, extendedListReviewed, getSafeApp, url],
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

export { useSecurityFeedbackModal }
