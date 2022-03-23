import { useEffect } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { matchPath } from 'react-router-dom'
import { Location } from 'history'
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

export const getAnonymizedLocation = ({ pathname, search, hash }: Location = history.location): string => {
  const ANON_SAFE_ADDRESS = 'SAFE_ADDRESS'
  const ANON_TX_ID = 'TRANSACTION_ID'

  let anonPathname = pathname

  // Anonymize safe address
  const safeAddressMatch = matchPath(pathname, { path: ADDRESSED_ROUTE })
  if (safeAddressMatch) {
    anonPathname = anonPathname.replace(safeAddressMatch.params[SAFE_ADDRESS_SLUG], ANON_SAFE_ADDRESS)
  }

  // Anonymise transaction id
  const txIdMatch = matchPath(pathname, { path: SAFE_ROUTES.TRANSACTIONS_SINGULAR })
  if (txIdMatch) {
    anonPathname = anonPathname.replace(txIdMatch.params[TRANSACTION_ID_SLUG], ANON_TX_ID)
  }

  return anonPathname + search + hash
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
}

let currentPathname = history.location.pathname
export const loadGoogleTagManager = (): void => {
  const GTM_ENVIRONMENT = IS_PRODUCTION ? GTM_ENV_AUTH.LIVE : GTM_ENV_AUTH.DEVELOPMENT

  if (!GOOGLE_TAG_MANAGER_ID || !GTM_ENVIRONMENT.auth) {
    console.warn('[GTM] - Unable to initialize Google Tag Manager. `id` or `gtm_auth` missing.')
    return
  }

  // Cache name to prevent tracking of same page
  currentPathname = history.location.pathname

  const page = getAnonymizedLocation()

  TagManager.initialize({
    gtmId: GOOGLE_TAG_MANAGER_ID,
    ...GTM_ENVIRONMENT,
    dataLayer: {
      // Must emit (custom) event in order to trigger page tracking
      event: GTM_EVENT.PAGEVIEW,
      chainId: _getChainId(),
      page,
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

export const usePageTracking = (): void => {
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    const unsubscribe = history.listen((location) => {
      if (location.pathname === currentPathname) {
        return
      }

      currentPathname = location.pathname

      TagManager.dataLayer({
        dataLayer: {
          // Must emit (custom) event in order to trigger page tracking
          event: GTM_EVENT.PAGEVIEW,
          chainId,
          page: getAnonymizedLocation(location),
          // Clear dataLayer
          eventCategory: undefined,
          eventAction: undefined,
          eventLabel: undefined,
        },
      })
    })

    return () => {
      unsubscribe()
    }
  }, [chainId])
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

export const trackEvent = ({
  event,
  category,
  action,
  label,
}: {
  event: GTM_EVENT
  category: string
  action: string
  label?: EventLabel
}): void => {
  const dataLayer = {
    event,
    chainId: _getChainId(),
    eventCategory: category,
    eventAction: action,
    eventLabel: tryParse(label),
  }

  if (!IS_PRODUCTION) {
    console.info('[GTM]', dataLayer)
  }

  TagManager.dataLayer({
    dataLayer,
  })
}
