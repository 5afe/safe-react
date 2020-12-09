import { useCallback, useEffect, useState } from 'react'
import ReactGA, { EventArgs } from 'react-ga'
import { getNetworkInfo } from 'src/config'

import { getGoogleAnalyticsTrackingID } from 'src/config'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { loadFromCookie } from 'src/logic/cookies/utils'

export const SAFE_NAVIGATION_EVENT = 'Safe Navigation'

let analyticsLoaded = false
export const loadGoogleAnalytics = (): void => {
  if (analyticsLoaded) {
    return
  }
  // eslint-disable-next-line no-console
  console.log('Loading google analytics...')
  const trackingID = getGoogleAnalyticsTrackingID()
  const networkInfo = getNetworkInfo()
  if (!trackingID) {
    console.error('[GoogleAnalytics] - In order to use google analytics you need to add an trackingID')
  } else {
    ReactGA.initialize(trackingID)
    ReactGA.set({
      anonymizeIp: true,
      appName: `Gnosis Safe Multisig (${networkInfo.label})`,
      appId: `io.gnosis.safe.${networkInfo.label.toLowerCase()}`,
      appVersion: process.env.REACT_APP_APP_VERSION,
    })
    analyticsLoaded = true
  }
}

type UseAnalyticsResponse = {
  trackPage: (path: string) => void
  trackEvent: (event: EventArgs) => void
}

export const useAnalytics = (): UseAnalyticsResponse => {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState = await loadFromCookie(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedAnalytics } = cookiesState
        setAnalyticsAllowed(acceptedAnalytics)
      }
    }
    fetchCookiesFromStorage()
  }, [])

  const trackPage = (page) => {
    if (!analyticsAllowed || !analyticsLoaded) {
      return
    }
    ReactGA.pageview(page)
  }

  const trackEvent = useCallback(
    (event: EventArgs) => {
      if (!analyticsAllowed || !analyticsLoaded) {
        return
      }
      ReactGA.event(event)
    },
    [analyticsAllowed],
  )

  return { trackPage, trackEvent }
}
