import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { OPEN_COOKIE_BANNER } from 'src/logic/cookies/store/actions/openCookieBanner'

export const COOKIES_REDUCER_ID = 'cookies'

export default handleActions(
  {
    [OPEN_COOKIE_BANNER]: (state, action) => state.set('cookieBannerOpen', action.payload),
  },
  Map(),
)
