import { useCallback, useEffect, useState } from 'react'
import GoogleAnalytics, { EventArgs } from 'react-ga'

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
  if (!trackingID) {
    console.error('[GoogleAnalytics] - In order to use google analytics you need to add an trackingID')
  } else {
    GoogleAnalytics.initialize(trackingID)
    GoogleAnalytics.set({ anonymizeIp: true })
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

  const trackPage = useCallback(
    (page) => {
      if (!analyticsAllowed || !analyticsLoaded) {
        return
      }
      GoogleAnalytics.pageview(page)
    },
    [analyticsAllowed],
  )

  const trackEvent = useCallback(
    (event: EventArgs) => {
      if (!analyticsAllowed || !analyticsLoaded) {
        return
      }
      GoogleAnalytics.event(event)
    },
    [analyticsAllowed],
  )

  return { trackPage, trackEvent }
}
