import { Map } from 'immutable'
import { handleActions } from 'redux-actions'
import { OPEN_COOKIE_BANNER } from 'src/logic/cookies/store/actions/openCookieBanner'
import { AppReduxState } from 'src/store'

export const COOKIES_REDUCER_ID = 'cookies'

export type OpenCookieBannerPayload = { cookieBannerOpen: boolean; intercomAlertDisplayed?: boolean }

export default handleActions<AppReduxState['cookies'], OpenCookieBannerPayload>(
  {
    [OPEN_COOKIE_BANNER]: (state, action) => {
      const { intercomAlertDisplayed = false, cookieBannerOpen } = action.payload
      return state.set('cookieBannerOpen', { intercomAlertDisplayed, cookieBannerOpen })
    },
  },
  Map(),
)
