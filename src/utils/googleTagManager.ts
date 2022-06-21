import { useEffect, useRef } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { matchPath, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { ADDRESSED_ROUTE, history, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'
import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_TAG_MANAGER_AUTH_LIVE,
  GOOGLE_TAG_MANAGER_AUTH_LATEST,
  IS_PRODUCTION,
  GOOGLE_TAG_MANAGER_DEVELOPMENT_AUTH,
} from 'src/utils/constants'
import { _getChainId } from 'src/config'
import { currentChainId } from 'src/logic/config/store/selectors'
import { Cookie, removeCookies } from 'src/logic/cookies/utils'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { EMPTY_SAFE_APP } from 'src/routes/safe/components/Apps/utils'

export const getAnonymizedPathname = (pathname: string = history.location.pathname): string => {
  const ANON_SAFE_ADDRESS = 'SAFE_ADDRESS'
  const ANON_TX_ID = 'TRANSACTION_ID'

  let anonPathname = pathname

  // Anonymize safe address
  const safeAddressMatch = matchPath(pathname, { path: ADDRESSED_ROUTE })
  if (safeAddressMatch) {
    anonPathname = anonPathname.replace(safeAddressMatch.params[SAFE_ADDRESS_SLUG], ANON_SAFE_ADDRESS)
  }

  // Anonymise transaction id
  const txIdMatch = matchPath<{ [TRANSACTION_ID_SLUG]: string }>(pathname, {
    path: SAFE_ROUTES.TRANSACTIONS_SINGULAR,
  })

  const queueHistoryMatch = matchPath(pathname, {
    path: [SAFE_ROUTES.TRANSACTIONS_HISTORY, SAFE_ROUTES.TRANSACTIONS_QUEUE],
  })

  const isSingularTxView = txIdMatch && !queueHistoryMatch

  if (isSingularTxView) {
    anonPathname = anonPathname.replace(txIdMatch.params[TRANSACTION_ID_SLUG], ANON_TX_ID)
  }

  return anonPathname
}

type GTMEnvironment = 'LIVE' | 'LATEST' | 'DEVELOPMENT'
type GTMEnvironmentArgs = Required<Pick<TagManagerArgs, 'auth' | 'preview'>>

const GTM_ENV_AUTH: Record<GTMEnvironment, GTMEnvironmentArgs> = {
  LIVE: {
    auth: GOOGLE_TAG_MANAGER_AUTH_LIVE,
    preview: 'env-1',
  },
  LATEST: {
    auth: GOOGLE_TAG_MANAGER_AUTH_LATEST,
    preview: 'env-2',
  },
  DEVELOPMENT: {
    auth: GOOGLE_TAG_MANAGER_DEVELOPMENT_AUTH,
    preview: 'env-3',
  },
}

export enum GTM_EVENT {
  PAGEVIEW = 'pageview',
  CLICK = 'customClick',
  META = 'metadata',
  SAFE_APP = 'safeApp',
}

export const loadGoogleTagManager = (): void => {
  const GTM_ENVIRONMENT = IS_PRODUCTION ? GTM_ENV_AUTH.LIVE : GTM_ENV_AUTH.DEVELOPMENT

  if (!GOOGLE_TAG_MANAGER_ID || !GTM_ENVIRONMENT.auth) {
    console.warn('[GTM] - Unable to initialize Google Tag Manager. `id` or `gtm_auth` missing.')
    return
  }

  const pagePath = getAnonymizedPathname()

  TagManager.initialize({
    gtmId: GOOGLE_TAG_MANAGER_ID,
    ...GTM_ENVIRONMENT,
    dataLayer: {
      // Must emit (custom) event in order to trigger page tracking
      event: GTM_EVENT.PAGEVIEW,
      chainId: _getChainId(),
      pageLocation: `${location.origin}${pagePath}`,
      pagePath,
      // Block JS variables and custom scripts
      // @see https://developers.google.com/tag-platform/tag-manager/web/restrict
      'gtm.blocklist': ['j', 'jsm', 'customScripts'],
    },
  })
}

export const unloadGoogleTagManager = (): void => {
  if (!window.dataLayer) {
    return
  }

  const GOOGLE_ANALYTICS_COOKIE_LIST: Cookie[] = [
    { name: '_ga', path: '/' },
    { name: '_gat', path: '/' },
    { name: '_gid', path: '/' },
  ]

  removeCookies(GOOGLE_ANALYTICS_COOKIE_LIST)
}

type PageViewDataLayer = {
  event: GTM_EVENT
  chainId: string
  pageLocation: string
  pagePath: string
  eventCategory: undefined
  eventAction: undefined
  eventLabel: undefined
}

export const usePageTracking = (): void => {
  const didMount = useRef(false)
  const { pathname } = useLocation()
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const pagePath = getAnonymizedPathname()

    const event: PageViewDataLayer = {
      // Must emit (custom) event in order to trigger page tracking
      event: GTM_EVENT.PAGEVIEW,
      chainId,
      pageLocation: `${location.origin}${pagePath}`,
      pagePath,
      // Clear dataLayer
      eventCategory: undefined,
      eventAction: undefined,
      eventLabel: undefined,
    }
    track(event)
  }, [chainId, pathname])
}

export type EventLabel = string | number | boolean | null
const tryParse = (value?: EventLabel): EventLabel | undefined => {
  if (typeof value !== 'string') {
    return value
  }
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

type EventDataLayer = {
  event: GTM_EVENT
  chainId: string
  eventCategory: string
  eventAction: string
  eventLabel?: EventLabel
}

export type CustomEvent = {
  event: GTM_EVENT
  category: string
  action: string
  label?: EventLabel
}

export const trackEvent = ({ event, category, action, label }: CustomEvent): void => {
  const dataLayer: EventDataLayer = {
    event,
    chainId: _getChainId(),
    eventCategory: category,
    eventAction: action,
    eventLabel: tryParse(label),
  }

  track(dataLayer)
}

type SafeAppEventDataLayer = {
  event: GTM_EVENT.SAFE_APP
  chainId: string
  safeAppName: string
  safeAppMethod: string
  safeAppEthMethod?: string
  safeAppSDKVersion?: string
}

export const getSafeAppName = (safeApp?: SafeApp): string => {
  if (!safeApp?.id) {
    return EMPTY_SAFE_APP
  }

  try {
    const parsedSafeApp = JSON.parse(safeApp.id)

    return parsedSafeApp.name || parsedSafeApp.url
  } catch (error) {
    return EMPTY_SAFE_APP
  }
}

export const trackSafeAppMessage = ({
  app,
  method,
  params,
  sdkVersion,
}: {
  app?: SafeApp
  method: string
  params?: any
  sdkVersion?: string
}): void => {
  const dataLayer: SafeAppEventDataLayer = {
    event: GTM_EVENT.SAFE_APP,
    chainId: _getChainId(),
    safeAppName: getSafeAppName(app),
    safeAppMethod: method,
    safeAppEthMethod: params?.call,
    safeAppSDKVersion: sdkVersion,
  }

  track(dataLayer)
}

function track(dataLayer: EventDataLayer | SafeAppEventDataLayer | PageViewDataLayer) {
  if (!IS_PRODUCTION) {
    console.info('[GTM]', dataLayer)
  }

  TagManager.dataLayer({
    dataLayer,
  })
}
