import { ComponentProps, useEffect } from 'react'
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
import Track from 'src/components/Track'
import { getChainInfo } from 'src/config'

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
  TRACK = 'data-track-event',
}

export enum GTM_DATA_LAYER_VARS {
  // Tracked with 'pageview'
  PAGE = 'page',
  // Following are tracked alongside 'data-track-event'
  ID = 'data-track-id',
  DESC = 'data-track-desc',
  CHAIN = 'data-track-chain',
  PAYLOAD = 'data-track-payload',
  GTM_DATA_LAYER_VARS = 'GTM_DATA_LAYER_VARS',
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
      // Must emit (custom) event in order to trigger page tracking
      event: GTM_EVENTS.PAGE_VIEW,
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

type TrackDataProps = {
  id: string
  desc: string
  payload?: Record<string, string | number | boolean | null>
}

type DataLayerPayload = {
  [GTM_DATA_LAYER_VARS.ID]: string
  [GTM_DATA_LAYER_VARS.DESC]: string
  [GTM_DATA_LAYER_VARS.CHAIN]: string
  [GTM_DATA_LAYER_VARS.PAYLOAD]?: string
}

export const getTrackDataLayer = ({ id, desc, payload }: TrackDataProps): DataLayerPayload => {
  const { chainId, shortName } = getChainInfo()

  const dataLayer = {
    [GTM_DATA_LAYER_VARS.ID]: id,
    [GTM_DATA_LAYER_VARS.DESC]: desc,
    [GTM_DATA_LAYER_VARS.CHAIN]: JSON.stringify({ chainId, shortName }),
    ...(payload && { [GTM_DATA_LAYER_VARS.PAYLOAD]: JSON.stringify(payload) }),
  }

  return dataLayer
}

export const trackEvent = (event: Omit<ComponentProps<typeof Track>, 'children'>): void => {
  TagManager.dataLayer({
    dataLayer: {
      event: GTM_EVENTS.TRACK,
      ...getTrackDataLayer(event),
    },
  })
}
