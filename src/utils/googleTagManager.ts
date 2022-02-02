import TagManager, { TagManagerArgs } from 'react-gtm-module'

import {
  GOOGLE_TAG_MANAGER_ID,
  GOOGLE_TAG_MANAGER_AUTH_LIVE,
  GOOGLE_TAG_MANAGER_AUTH_LATEST,
  IS_PRODUCTION,
} from 'src/utils/constants'

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
    auth: 'kUsn0oQ2nl5LbQdqhkYoDA',
    preview: 'env-3',
  },
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
  })
}
