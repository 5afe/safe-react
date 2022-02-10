import { useEffect } from 'react'
import TagManager, { TagManagerArgs } from 'react-gtm-module'
import { matchPath } from 'react-router-dom'
import { Location } from 'history'

import { ADDRESSED_ROUTE, history, SAFE_ADDRESS_SLUG, SAFE_ROUTES, TRANSACTION_ID_SLUG } from 'src/routes/routes'

import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_TAG_MANAGER_AUTH_LIVE,
  GOOGLE_TAG_MANAGER_AUTH_LATEST,
  IS_PRODUCTION,
  GOOGLE_TAG_MANAGER_DEVELOPMENT_AUTH,
} from 'src/utils/constants'

const getAnonymizedLocation = ({ pathname, search, hash }: Location = history.location): string => {
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

enum GTM_EVENTS {
  PAGE_VIEW = 'pageview',
}

enum GTM_DATA_LAYER_VARS {
  PAGE = 'page', // Tracked alongside 'pageview' event
}

export const loadGoogleTagManager = (): void => {
  const GTM_ENVIRONMENT = IS_PRODUCTION ? GTM_ENV_AUTH.LIVE : GTM_ENV_AUTH.DEVELOPMENT

  if (!GOOGLE_TAG_MANAGER_ID || !GTM_ENVIRONMENT.auth) {
    console.warn('Unable to initialise Google Tag Manager. `id` or `gtm_auth` missing.')
    return
  }

  TagManager.initialize({
    gtmId: GOOGLE_TAG_MANAGER_ID,
    ...GTM_ENVIRONMENT,
    dataLayer: {
      // Page Safe was loaded at
      [GTM_DATA_LAYER_VARS.PAGE]: getAnonymizedLocation(),
    },
  })
}

export const useGTMPageTracking = (): void => {
  useEffect(() => {
    const unsubscribe = history.listen((location) => {
      TagManager.dataLayer({
        dataLayer: {
          // Must emit (custom) event in order to trigger page tracking
          event: GTM_EVENTS.PAGE_VIEW,
          [GTM_DATA_LAYER_VARS.PAGE]: getAnonymizedLocation(location),
        },
      })
    })

    return () => {
      unsubscribe()
    }
  }, [])
}
