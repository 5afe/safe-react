import { createAction } from 'redux-actions'

export const OPEN_COOKIE_BANNER = 'OPEN_COOKIE_BANNER'

export const openCookieBanner = createAction(OPEN_COOKIE_BANNER, (cookieBannerOpen) => ({
  cookieBannerOpen,
}))
