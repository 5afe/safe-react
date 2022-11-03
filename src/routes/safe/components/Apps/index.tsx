import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import SecurityFeedbackModal from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal'
import SafeAppsErrorBoundary from 'src/routes/safe/components/Apps/components/SafeAppsErrorBoundary'
import SafeAppsLoadError from 'src/routes/safe/components/Apps/components/SafeAppsLoadError'
import { useSecurityFeedbackModal } from 'src/routes/safe/components/Apps/hooks/useSecurityFeedbackModal'
import { useSafeAppFromManifest } from 'src/routes/safe/components/Apps/hooks/useSafeAppFromManifest'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { useBrowserPermissions } from 'src/routes/safe/components/Apps/hooks/permissions'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const { addPermissions, getPermissions, getAllowedFeaturesList } = useBrowserPermissions()
  const { isLoading: isSafeAppListLoading, getSafeApp } = useAppList()
  const { isLoading: isSafeAppManifestLoading, safeApp: safeAppManifest } = useSafeAppFromManifest(url)

  const {
    isModalVisible,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    isConsentAccepted,
    isPermissionsReviewCompleted,
    isExtendedListReviewed,
    onComplete,
    onRemoveCustomApp,
  } = useSecurityFeedbackModal({ url, safeAppManifest, safeApp: getSafeApp(url), addPermissions, getPermissions })

  const goBack = useCallback(() => history.goBack(), [history])

  if (isSafeAppListLoading || isSafeAppManifestLoading) {
    return <div />
  }

  if (url) {
    if (isModalVisible) {
      return (
        <SecurityFeedbackModal
          onCancel={goBack}
          onConfirm={onComplete}
          appUrl={url}
          features={safeAppManifest.safeAppsPermissions || []}
          isConsentAccepted={isConsentAccepted}
          isSafeAppInDefaultList={isSafeAppInDefaultList}
          isFirstTimeAccessingApp={isFirstTimeAccessingApp}
          isExtendedListReviewed={isExtendedListReviewed}
          isPermissionsReviewCompleted={isPermissionsReviewCompleted}
        />
      )
    }

    return (
      <SafeAppsErrorBoundary render={() => <SafeAppsLoadError />}>
        <AppFrame appUrl={url} allowedFeaturesList={getAllowedFeaturesList(url)} />
      </SafeAppsErrorBoundary>
    )
  } else {
    return <AppsList onRemoveApp={onRemoveCustomApp} />
  }
}

export default Apps
