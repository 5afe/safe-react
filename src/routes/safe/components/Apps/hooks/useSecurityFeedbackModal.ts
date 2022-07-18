import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { useSafeAppManifest } from './useSafeAppManifest'
import { useBrowserPermissions } from './permissions/useBrowserPermissions'

const APPS_SECURITY_FEEDBACK_MODAL = 'APPS_SECURITY_FEEDBACK_MODAL'

type SecurityFeedbackModalStorage = {
  appsReviewed: string[]
  extendedListReviewed: boolean
  customAppsReviewed: string[]
  consentAccepted: boolean
}

const useSecurityFeedbackModal = (): {
  isModalVisible: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isConsentAccepted: boolean
  isExtendedListReviewed: boolean
  isPermissionsReviewCompleted: boolean
  onComplete: (shouldHide: boolean) => void
  onRemoveCustomApp: (appUrl: string) => void
} => {
  const didMount = useRef(false)

  const { isLoading: isSafeAppListLoading, getSafeApp } = useAppList()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const { isLoading: isSafeAppManifestLoading, safeApp } = useSafeAppManifest(url)
  const { getPermissions } = useBrowserPermissions()
  const [appsReviewed, setAppsReviewed] = useState<string[]>([])
  const [extendedListReviewed, setExtendedListReviewed] = useState(false)
  const [customAppsReviewed, setCustomAppsReviewed] = useState<string[]>([])
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false)
  const [isDisclaimerReadingCompleted, setIsDisclaimerReadingCompleted] = useState(false)

  useEffect(() => {
    const securityStepsStatus: SecurityFeedbackModalStorage = loadFromStorage(APPS_SECURITY_FEEDBACK_MODAL) || {
      appsReviewed: [],
      extendedListReviewed: false,
      customAppsReviewed: [],
      consentAccepted: false,
    }

    if (securityStepsStatus) {
      setAppsReviewed(securityStepsStatus.appsReviewed)
      setExtendedListReviewed(securityStepsStatus.extendedListReviewed)
      setCustomAppsReviewed(securityStepsStatus.customAppsReviewed)
      setConsentAccepted(securityStepsStatus.consentAccepted)
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
      consentAccepted,
    })
  }, [appsReviewed, consentAccepted, customAppsReviewed, extendedListReviewed])

  const isSafeAppInDefaultList = useMemo(() => {
    if (!url) return false

    return !!getSafeApp(url)
  }, [getSafeApp, url])

  const isFirstTimeAccessingApp = useMemo(() => {
    if (!url) return true

    const safeAppId = getSafeApp(url)?.id

    return safeAppId ? !appsReviewed?.includes(safeAppId) : !customAppsReviewed?.includes(url)
  }, [appsReviewed, customAppsReviewed, getSafeApp, url])

  const isPermissionsReviewCompleted = useMemo(() => {
    if (!url) return false

    const currentAllowedFeatures = getPermissions(url)

    return safeApp.safeAppsPermissions.every((feature) => currentAllowedFeatures.includes(feature))
  }, [getPermissions, safeApp.safeAppsPermissions, url])

  const isModalVisible = useMemo(() => {
    const isComponentReady = !isSafeAppListLoading && !isSafeAppManifestLoading && didMount.current
    const shouldShowLegalDisclaimer = !consentAccepted
    const shouldShowAllowedFeatures = !isPermissionsReviewCompleted
    const shouldShowSecurityPractices = isSafeAppInDefaultList && isFirstTimeAccessingApp
    const shouldShowUnknownAppWarning =
      !isSafeAppInDefaultList && isFirstTimeAccessingApp && !isDisclaimerReadingCompleted

    return (
      isComponentReady &&
      (shouldShowLegalDisclaimer ||
        shouldShowSecurityPractices ||
        shouldShowUnknownAppWarning ||
        shouldShowAllowedFeatures)
    )
  }, [
    isSafeAppListLoading,
    isSafeAppManifestLoading,
    consentAccepted,
    isPermissionsReviewCompleted,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    isDisclaimerReadingCompleted,
  ])

  const onComplete = useCallback(
    (shouldHide: boolean) => {
      setConsentAccepted(true)

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

  const onRemoveCustomApp = useCallback(
    (appUrl: string): void => {
      const reviewedApps = customAppsReviewed.filter((url) => url !== appUrl)
      setCustomAppsReviewed(reviewedApps)
    },
    [customAppsReviewed],
  )

  return {
    isModalVisible,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    isPermissionsReviewCompleted,
    isConsentAccepted: consentAccepted,
    isExtendedListReviewed: extendedListReviewed,
    onComplete,
    onRemoveCustomApp,
  }
}

export { useSecurityFeedbackModal }
