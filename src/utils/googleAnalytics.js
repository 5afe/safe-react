// @flow
import React, { useEffect, useState } from 'react'
import GoogleAnalytics from 'react-ga'
import { getGoogleAnalyticsTrackingID } from '~/config'
import { COOKIES_KEY } from '~/logic/cookies/model/cookie'
import type { CookiesProps } from '~/logic/cookies/model/cookie'
import type { RouterProps } from '~/routes/safe/store/selectors'
import { loadFromCookie } from '~/logic/cookies/utils'

const trackingID = getGoogleAnalyticsTrackingID()

if (!trackingID) {
  console.error('[GoogleAnalytics] - In order to use google analytics you need to add an trackingID')
} else {
  GoogleAnalytics.initialize(trackingID)
}


const withTracker = (WrappedComponent, options = {}) => {
  const [useAnalytics, setUseAnalytics] = useState(false)

  useEffect(() => {
    async function fetchCookiesFromStorage() {
      const cookiesState: CookiesProps = await loadFromCookie(COOKIES_KEY)
      if (cookiesState) {
        const { acceptedAnalytics } = cookiesState
        setUseAnalytics(acceptedAnalytics)
      }
    }
    fetchCookiesFromStorage()
  }, [])

  const trackPage = (page) => {
    if (!useAnalytics) {
      return
    }
    GoogleAnalytics.set({
      page,
      ...options,
    })
    GoogleAnalytics.pageview(page)
  }

  const HOC = (props: RouterProps) => {
    // eslint-disable-next-line react/prop-types
    const { location } = props
    useEffect(() => {
      const page = location.pathname + location.search
      trackPage(page)
    }, [location.pathname])
    return <WrappedComponent {...props} />
  }

  return HOC
}

export default withTracker
