import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
import { useLegalConsent } from 'src/routes/safe/components/Apps/hooks/useLegalConsent'
import SafeAppsDisclaimer from './components/Disclaimer'
import SafeAppsErrorBoundary from './components/SafeAppsErrorBoundary'
import SafeAppsLoadError from './components/SafeAppsLoadError'
import { useAppList } from './hooks/appList/useAppList'
import { useSecuritySteps } from './hooks/useSecuritySteps'

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const { getAppUrl } = useSafeAppUrl()
  const url = getAppUrl()
  const [isDisclaimerReadingCompleted, setIsDisclaimerReadingCompleted] = useState(false)
  const { isLoading, appList, getSafeApp } = useAppList()
  const { consentReceived, onConsentReceipt } = useLegalConsent()
  const { appsReviewed, onReviewApp } = useSecuritySteps()

  useEffect(() => {
    if (!url) {
      setIsDisclaimerReadingCompleted(false)
    }
  }, [url])

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

    return safeAppId ? !appsReviewed?.includes(safeAppId) : true
  }, [appsReviewed, getSafeApp, url])

  const handleConfirm = useCallback(() => {
    onConsentReceipt()

    const safeAppId = getSafeApp(url)?.id

    if (safeAppId) {
      onReviewApp(safeAppId)
    }

    setIsDisclaimerReadingCompleted(true)
  }, [getSafeApp, onConsentReceipt, onReviewApp, url])

  const goBack = useCallback(() => history.goBack(), [history])

  const showDisclaimer =
    !isLoading &&
    (!consentReceived ||
      (isSafeAppInDefaultList && isFirstTimeAccessingApp) ||
      (!isSafeAppInDefaultList && !isDisclaimerReadingCompleted))

  if (url) {
    if (showDisclaimer) {
      return (
        <SafeAppsDisclaimer
          onCancel={goBack}
          onConfirm={handleConfirm}
          isConsentAccepted={consentReceived}
          isSafeAppInDefaultList={isSafeAppInDefaultList}
          isFirstTimeAccessingApp={isFirstTimeAccessingApp}
        />
      )
    }

    return (
      <SafeAppsErrorBoundary render={() => <SafeAppsLoadError />}>
        <AppFrame appUrl={url} />
      </SafeAppsErrorBoundary>
    )
  } else {
    return <AppsList />
  }
}

export default Apps
