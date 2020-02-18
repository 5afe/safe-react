// @flow
import { createAction } from 'redux-actions'

export const OPEN_COOKIE_BANNER = 'OPEN_COOKIE_BANNER'

export const openCookieBanner = createAction<string, *, *>(OPEN_COOKIE_BANNER, (cookieBannerOpen: boolean) => ({
  cookieBannerOpen,
}))
