import { useCallback, useEffect, useState } from 'react'
import ReactGA, { EventArgs, FieldsObject } from 'react-ga'

import { getCurrentEnvironment, getNetworkInfo } from 'src/config'
import { getGoogleAnalyticsTrackingID } from 'src/config'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { loadFromCookie, removeCookie } from 'src/logic/cookies/utils'
import { IS_PRODUCTION } from './constants'

const IS_STAGING = getCurrentEnvironment() === 'staging'
const SHOULD_TRACK_ANALYTICS = IS_PRODUCTION || IS_STAGING

export const SAFE_NAVIGATION_EVENT = 'Safe Navigation'

const setFieldObjects = (fieldsObjects: Omit<FieldsObject, 'dimension1'> = {}) => {
  ReactGA.set({
    ...fieldsObjects,
    dimension1: getNetworkInfo().label, // 'chain
  })
}

// trackAnalyticsEvent appends dimension1
type TrackAnalyticsEventEvent = Omit<EventArgs, 'dimension1'>
export const trackAnalyticsEvent = (event: TrackAnalyticsEventEvent): void => {
  if (SHOULD_TRACK_ANALYTICS) {
    setFieldObjects()
    ReactGA.event(event)
  } else {
    console.info('[GA] - Event:', event)
  }
}

type TrackAnalyticsPagePage = Parameters<typeof ReactGA.pageview>[0]
const trackAnalyticsPage = (page: TrackAnalyticsPagePage): void => {
  if (SHOULD_TRACK_ANALYTICS) {
    setFieldObjects()
    ReactGA.pageview(page)
  } else {
    console.info('[GA] - Page:', page)
  }
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
    appName: 'Gnosis Safe Multisig', // Name on GA
    appVersion: process.env.REACT_APP_APP_VERSION,
  }

  if (SHOULD_TRACK_ANALYTICS) {
    if (!gaTrackingId) {
      console.error('In order to use Google Analytics you need to add a tracking ID.')
    } else {
      ReactGA.initialize(gaTrackingId, { debug: true })
      setFieldObjects(fieldsObject)
    }
  } else {
    console.info('[GA] - Fields:', fieldsObject)
  }
}

type UseAnalyticsResponse = {
  trackPage: (path: TrackAnalyticsPagePage) => void
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
