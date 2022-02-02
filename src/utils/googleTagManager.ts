import TagManager, { TagManagerArgs } from 'react-gtm-module'

import { GTM_AUTH_LIVE, GTM_AUTH_LATEST, IS_PRODUCTION } from 'src/utils/constants'

type GTMEnvironment = 'LIVE' | 'LATEST' | 'DEVELOPMENT'
type GTMEnvironmentArgs = Required<Pick<TagManagerArgs, 'auth' | 'preview'>>

const GTM_ID: TagManagerArgs['gtmId'] = 'GTM-TSZSBRK'
const GTM_ENV_AUTH: Record<GTMEnvironment, GTMEnvironmentArgs> = {
  LIVE: {
    auth: GTM_AUTH_LIVE,
    preview: 'env-1',
  },
  LATEST: {
    auth: GTM_AUTH_LATEST,
    preview: 'env-2',
  },
  DEVELOPMENT: {
    auth: 'kUsn0oQ2nl5LbQdqhkYoDA',
    preview: 'env-3',
  },
}

export const loadGoogleTagManager = (): void => {
  const GTM_ENVIRONMENT = IS_PRODUCTION ? GTM_ENV_AUTH.LIVE : GTM_ENV_AUTH.DEVELOPMENT

  if (!GTM_ENVIRONMENT.auth) {
    console.warn('Unable to initialise GTM. No `gtm_auth` found.')
    return
  }

  TagManager.initialize({
    gtmId: GTM_ID,
    ...GTM_ENVIRONMENT,
  })
}
