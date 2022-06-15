import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSafeAppUrl } from 'src/logic/hooks/useSafeAppUrl'
import AppFrame from 'src/routes/safe/components/Apps/components/AppFrame'
import AppsList from 'src/routes/safe/components/Apps/components/AppsList'
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

  const {
    appsReviewed,
    onReviewApp,
    extendedListReviewed,
    onReviewExtendedList,
    hideCustomAppsWarning,
    onHideCustomAppsWarning,
    consentReceived,
    onConsentReceipt,
  } = useSecuritySteps()

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

  const handleConfirm = useCallback(
    (shouldHide: boolean) => {
      onConsentReceipt()

      const safeAppId = getSafeApp(url)?.id

      if (safeAppId) {
        onReviewApp(safeAppId)
      }

      if (!extendedListReviewed) {
        onReviewExtendedList()
      }

      if (!hideCustomAppsWarning && shouldHide) {
        onHideCustomAppsWarning()
      }

      setIsDisclaimerReadingCompleted(true)
    },
    [
      extendedListReviewed,
      getSafeApp,
      hideCustomAppsWarning,
      onConsentReceipt,
      onHideCustomAppsWarning,
      onReviewApp,
      onReviewExtendedList,
      url,
    ],
  )

  const goBack = useCallback(() => history.goBack(), [history])

  const showDisclaimer =
    !isLoading &&
    (!consentReceived ||
      (isSafeAppInDefaultList && isFirstTimeAccessingApp) ||
      (!isSafeAppInDefaultList && !isDisclaimerReadingCompleted && !hideCustomAppsWarning))

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
          isWarningHidden={hideCustomAppsWarning}
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
