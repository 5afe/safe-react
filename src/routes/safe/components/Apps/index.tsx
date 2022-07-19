import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import SecurityFeedbackModal from 'src/routes/safe/components/Apps/components/SecurityFeedbackModal'
import SafeAppsErrorBoundary from 'src/routes/safe/components/Apps/components/SafeAppsErrorBoundary'
import SafeAppsLoadError from 'src/routes/safe/components/Apps/components/SafeAppsLoadError'
import { useSecurityFeedbackModal } from './hooks/useSecurityFeedbackModal'
import { useSafeAppManifest } from './hooks/useSafeAppManifest'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const { safeApp } = useSafeAppManifest(url)

  const {
    isModalVisible,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    isConsentAccepted,
    isPermissionsReviewCompleted,
    isExtendedListReviewed,
    onComplete,
    onRemoveCustomApp,
  } = useSecurityFeedbackModal()

  const goBack = useCallback(() => history.goBack(), [history])

  if (url) {
    if (isModalVisible) {
      return (
        <SecurityFeedbackModal
          onCancel={goBack}
          onConfirm={onComplete}
          appUrl={url}
          features={safeApp.safeAppsPermissions}
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
        <AppFrame appUrl={url} />
      </SafeAppsErrorBoundary>
    )
  } else {
    return <AppsList onRemoveApp={onRemoveCustomApp} />
  }
}

export default Apps
