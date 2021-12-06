import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { OPEN_COOKIE_BANNER } from 'src/logic/cookies/store/actions/openCookieBanner'

export const COOKIES_REDUCER_ID = 'cookies'

type CookieState = Map<string, any>

export type OpenCookieBannerPayload = { cookieBannerOpen: boolean; intercomAlertDisplayed?: boolean }

const cookiesReducer = handleActions<CookieState, OpenCookieBannerPayload>(
  {
    [OPEN_COOKIE_BANNER]: (state, action) => {
      const { intercomAlertDisplayed = false, cookieBannerOpen } = action.payload
      return state.set('cookieBannerOpen', { intercomAlertDisplayed, cookieBannerOpen })
    },
  },
  Map(),
)

export default cookiesReducer
