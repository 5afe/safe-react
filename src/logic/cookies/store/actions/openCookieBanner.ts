import { createAction } from 'redux-actions'

import { OpenCookieBannerPayload } from 'src/logic/cookies/store/reducer/cookies'

export const OPEN_COOKIE_BANNER = 'OPEN_COOKIE_BANNER'

export const openCookieBanner = createAction<OpenCookieBannerPayload>(OPEN_COOKIE_BANNER)
