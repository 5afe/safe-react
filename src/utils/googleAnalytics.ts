import { useCallback, useEffect, useState } from 'react'
import ReactGA, { EventArgs } from 'react-ga'
import { useSelector } from 'react-redux'
import { getNetworkInfo, getNetworkId } from 'src/config'

import { getGoogleAnalyticsTrackingID } from 'src/config'
import { currentChainId } from 'src/logic/config/store/selectors'
import { COOKIES_KEY } from 'src/logic/cookies/model/cookie'
import { loadFromCookie, removeCookie } from 'src/logic/cookies/utils'
import { IS_PRODUCTION } from './constants'
import { capitalize } from './css'

export const SAFE_NAVIGATION_EVENT = 'Safe Navigation'

export const COOKIES_LIST = [
  { name: '_ga', path: '/' },
  { name: '_gat', path: '/' },
  { name: '_gid', path: '/' },
]

const shouldUseGoogleAnalytics = IS_PRODUCTION

export const trackAnalyticsEvent = (event: Parameters<typeof ReactGA.event>[0]): void => {
  const chainName = getNetworkInfo().label

  // action, category, label, etc. => eventAction, eventCategory, eventLabel, etc.
  const fieldsObject: Parameters<typeof ReactGA.ga>[1] = Object.entries(event).reduce(
    (acc, [key, value]) => ({ ...acc, [`event${capitalize(key)}`]: value }),
    { hitType: 'event', chainName },
  )

  return shouldUseGoogleAnalytics
    ? ReactGA.ga('send', fieldsObject)
    : console.info('[GA] - Event:', { ...event, chainName })
}
const trackAnalyticsPage: typeof ReactGA.pageview = (...args) => {
  return shouldUseGoogleAnalytics ? ReactGA.pageview(...args) : console.info('[GA] - Page:', ...args)
}

let analyticsLoaded = false
export const loadGoogleAnalytics = (): void => {
  if (analyticsLoaded) {
    return
  }

  console.info(
    shouldUseGoogleAnalytics
      ? 'Loading Google Analytics...'
      : 'Google Analytics will not load in the development environment, but instead log.',
  )

  const gaTrackingId = getGoogleAnalyticsTrackingID()

  const customDimensions: ReactGA.FieldsObject = {
    anonymizeIp: true,
    appName: `Gnosis Safe Web`,
    appVersion: process.env.REACT_APP_APP_VERSION,
    dimension1: getNetworkId(),
  }

  if (shouldUseGoogleAnalytics) {
    if (!gaTrackingId) {
      console.error('In order to use Google Analytics you need to add a tracking ID.')
    } else {
      ReactGA.initialize(gaTrackingId)
      ReactGA.set(customDimensions)
    }
  } else {
    console.info('[GA] - Custom dimensions:', customDimensions)
  }

  analyticsLoaded = true
}

type UseAnalyticsResponse = {
  trackPage: (path: string) => void
  trackEvent: (event: EventArgs) => void
}

export const useAnalytics = (): UseAnalyticsResponse => {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    if (analyticsAllowed && analyticsLoaded) {
      ReactGA.set({ dimension1: chainId })
    }
  }, [chainId, analyticsAllowed])

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
      if (analyticsAllowed && analyticsLoaded) {
        trackAnalyticsPage(page)
      }
    },
    [analyticsAllowed],
  )

  const trackEvent = useCallback(
    (event: EventArgs) => {
      if (analyticsAllowed && analyticsLoaded) {
        trackAnalyticsEvent(event)
      }
    },
    [analyticsAllowed],
  )

  return { trackPage, trackEvent }
}

// we remove GA cookies manually as react-ga does not provides a utility for it.
export const removeCookies = (): void => {
  // Extracts the main domain, e.g. gnosis-safe.io
  const subDomain = location.host.split('.').slice(-2).join('.')
  COOKIES_LIST.forEach((cookie) => removeCookie(cookie.name, cookie.path, `.${subDomain}`))
}
