import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import SafeAppsDisclaimer from './components/Disclaimer'
import SafeAppsErrorBoundary from './components/SafeAppsErrorBoundary'
import SafeAppsLoadError from './components/SafeAppsLoadError'
import { useSecuritySteps } from './hooks/useSecuritySteps'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()

  const {
    handleConfirm,
    showDisclaimer,
    consentReceived,
    isSafeAppInDefaultList,
    isFirstTimeAccessingApp,
    extendedListReviewed,
    onRemoveCustomApp,
  } = useSecuritySteps()

  const goBack = useCallback(() => history.goBack(), [history])

  if (url) {
    if (showDisclaimer) {
      return (
        <SafeAppsDisclaimer
          onCancel={goBack}
          onConfirm={handleConfirm}
          appUrl={url}
          isConsentAccepted={consentReceived}
          isSafeAppInDefaultList={isSafeAppInDefaultList}
          isFirstTimeAccessingApp={isFirstTimeAccessingApp}
          isExtendedListReviewed={extendedListReviewed}
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
