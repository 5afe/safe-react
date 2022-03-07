import { handleActions } from 'redux-actions'

import { COOKIE_IDS } from 'src/logic/cookies/model/cookie'
import { COOKIE_ACTIONS } from 'src/logic/cookies/store/actions/openCookieBanner'

export const COOKIES_REDUCER_ID = 'cookies'

export type CookieState = {
  cookieBannerOpen: boolean
  key?: COOKIE_IDS
}

const initialState: CookieState = {
  cookieBannerOpen: false,
  key: undefined,
}

export type OpenCookieBannerPayload = CookieState

const cookiesReducer = handleActions<CookieState, OpenCookieBannerPayload>(
  {
    [COOKIE_ACTIONS.OPEN_BANNER]: (_, action) => {
      return action.payload
    },
    [COOKIE_ACTIONS.CLOSE_BANNER]: () => {
      return initialState
    },
  },
  initialState,
)

export default cookiesReducer
