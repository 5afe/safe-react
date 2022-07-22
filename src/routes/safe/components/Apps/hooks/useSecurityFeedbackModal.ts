import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { BrowserPermission } from './permissions/useBrowserPermissions'
import { AllowedFeatures, PermissionStatus, SafeApp } from '../types'

const APPS_SECURITY_FEEDBACK_MODAL = 'APPS_SECURITY_FEEDBACK_MODAL'

type SecurityFeedbackModalStorage = {
  appsReviewed: string[]
  extendedListReviewed: boolean
  customAppsReviewed: string[]
  consentAccepted: boolean
}

type useSecurityFeedbackModal = {
  url: string
  safeApp?: SafeApp
  safeAppManifest?: SafeApp
  addPermissions: (origin: string, permissions: BrowserPermission[]) => void
  getPermissions: (origin: string) => BrowserPermission[]
}

const useSecurityFeedbackModal = ({
  url,
  safeApp,
  safeAppManifest,
  addPermissions,
  getPermissions,
}: useSecurityFeedbackModal): {
  isModalVisible: boolean
  isSafeAppInDefaultList: boolean
  isFirstTimeAccessingApp: boolean
  isConsentAccepted: boolean
  isExtendedListReviewed: boolean
  isPermissionsReviewCompleted: boolean
  onComplete: (shouldHide: boolean, permissions: BrowserPermission[]) => void
  onRemoveCustomApp: (appUrl: string) => void
} => {
  const didMount = useRef(false)

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

    return !!safeApp
  }, [safeApp, url])

  const isFirstTimeAccessingApp = useMemo(() => {
    if (!url) return true

    const safeAppId = safeApp?.id

    return safeAppId ? !appsReviewed?.includes(safeAppId) : !customAppsReviewed?.includes(url)
  }, [appsReviewed, customAppsReviewed, safeApp, url])

  const isPermissionsReviewCompleted = useMemo(() => {
    if (!url) return false

    const safeAppRequiredFeatures = safeAppManifest?.safeAppsPermissions || []
    const featureHasBeenGrantedOrDenied = (feature: AllowedFeatures) =>
      getPermissions(url).some((permission: BrowserPermission) => {
        return permission.feature === feature && permission.status !== PermissionStatus.PROMPT
      })

    // If the app add a new feature in the manifest we need to detect it and show the modal again
    return !!safeAppRequiredFeatures.every(featureHasBeenGrantedOrDenied)
  }, [getPermissions, safeAppManifest, url])

  const isModalVisible = useMemo(() => {
    const isComponentReady = didMount.current
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
    consentAccepted,
    isPermissionsReviewCompleted,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    isDisclaimerReadingCompleted,
  ])

  const onComplete = useCallback(
    (shouldHide: boolean, browserPermissions: BrowserPermission[]) => {
      setConsentAccepted(true)

      const safeAppId = safeApp?.id

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

      if (!isPermissionsReviewCompleted) {
        addPermissions(url, browserPermissions)
      }

      setIsDisclaimerReadingCompleted(true)
    },
    [
      addPermissions,
      appsReviewed,
      customAppsReviewed,
      extendedListReviewed,
      isPermissionsReviewCompleted,
      safeApp,
      url,
    ],
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
