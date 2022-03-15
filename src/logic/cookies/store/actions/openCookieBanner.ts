import { createAction } from 'redux-actions'

import { OpenCookieBannerPayload } from 'src/logic/cookies/store/reducer/cookies'

export enum COOKIE_ACTIONS {
  OPEN_BANNER = 'cookies/openCookieBanner',
  CLOSE_BANNER = 'cookies/closeCookieBanner',
}

export const openCookieBanner = createAction<OpenCookieBannerPayload>(COOKIE_ACTIONS.OPEN_BANNER)
export const closeCookieBanner = createAction(COOKIE_ACTIONS.CLOSE_BANNER)
