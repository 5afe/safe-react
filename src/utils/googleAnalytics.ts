import { useCallback, useEffect, useState } from 'react'
import ReactGA, { FieldsObject } from 'react-ga'

import { getCurrentEnvironment, getNetworkInfo } from 'src/config'
import { getGoogleAnalyticsTrackingID } from 'src/config'
import { NetworkSettings } from 'src/config/networks/network'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { loadFromCookie, removeCookie } from 'src/logic/cookies/utils'
import { IS_PRODUCTION } from './constants'

const IS_STAGING = getCurrentEnvironment() === 'staging'
const SHOULD_TRACK_ANALYTICS = IS_PRODUCTION || IS_STAGING

export const SAFE_NAVIGATION_EVENT = 'Safe Navigation'

type TrackAnalyticsEventEvent = {
  eventCategory: string
  eventAction: string
  eventLabel?: string
  eventValue?: number
}
export const trackAnalyticsEvent = (event: TrackAnalyticsEventEvent) => {
  // https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#events
  const fieldsObject: TrackAnalyticsEventEvent & {
    hitType: 'event'
    chain: NetworkSettings['label']
  } = {
    hitType: 'event',
    ...event,
    chain: getNetworkInfo().label, // Chain name
  }

  // React.event is not used because we want to track `{ chain }`, which is a custom var
  return SHOULD_TRACK_ANALYTICS ? ReactGA.ga('send', fieldsObject) : console.info('[GA] - Event:', fieldsObject)
}

type TrackAnalyticsPagePage = Parameters<typeof ReactGA.pageview>[0]
const trackAnalyticsPage: typeof ReactGA.pageview = (page: TrackAnalyticsPagePage) => {
  return SHOULD_TRACK_ANALYTICS ? ReactGA.pageview(page) : console.info('[GA] - Page:', page)
}

const analyticsLoaded = false
export const loadGoogleAnalytics = (): void => {
  if (analyticsLoaded) {
    return
  }

  console.info(
    SHOULD_TRACK_ANALYTICS
      ? 'Loading Google Analytics...'
      : 'Google Analytics will only log in the development environment.',
  )

  const gaTrackingId = getGoogleAnalyticsTrackingID()

  const fieldsObject: FieldsObject = {
    anonymizeIp: true,
    appName: `Gnosis Safe Web`,
    appVersion: process.env.REACT_APP_APP_VERSION,
  }

  if (SHOULD_TRACK_ANALYTICS) {
    if (!gaTrackingId) {
      console.error('In order to use Google Analytics you need to add a tracking ID.')
    } else {
      ReactGA.initialize(gaTrackingId)
      ReactGA.set(fieldsObject)
    }
  } else {
    console.info('[GA] - Fields:', fieldsObject)
  }
}

type UseAnalyticsResponse = {
  trackPage: (path: string) => void
  trackEvent: (event: TrackAnalyticsEventEvent) => void
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

  const trackEvent = useCallback(
    (event: TrackAnalyticsEventEvent) => {
      if (analyticsAllowed && analyticsLoaded) {
        trackAnalyticsEvent(event)
      }
    },
    [analyticsAllowed],
  )

  const trackPage = useCallback(
    (page: TrackAnalyticsPagePage) => {
      if (analyticsAllowed && analyticsLoaded) {
        trackAnalyticsPage(page)
      }
    },
    [analyticsAllowed],
  )

  return { trackPage, trackEvent }
}

const GOOGLE_ANALYTICS_COOKIE_NAMES = ['_ga', '_gat', '_gid']

// We remove GA cookies manually as ReactGA does not have the functionality to do so
export const removeGoogleAnalyticsCookies = (): void => {
  GOOGLE_ANALYTICS_COOKIE_NAMES.forEach((name) => removeCookie(name, '/', window.location.host))
}
