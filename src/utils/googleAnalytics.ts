import { useCallback, useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'

import { getGoogleAnalyticsTrackingID } from 'src/config'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { loadFromCookie } from 'src/logic/cookies/utils'

let analyticsLoaded = false
export const loadGoogleAnalytics = () => {
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

export const useAnalytics = () => {
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
    (page, options = {}) => {
      if (!analyticsAllowed || !analyticsLoaded) {
        return
      }
      GoogleAnalytics.set({
        page,
        ...options,
      })
      GoogleAnalytics.pageview(page)
    },
    [analyticsAllowed],
  )

  return { trackPage }
}
