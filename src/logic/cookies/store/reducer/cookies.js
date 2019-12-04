// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import type { Cookie } from '~/logic/cookies/model/cookie'
import { OPEN_COOKIE_BANNER } from '~/logic/cookies/store/actions/openCookieBanner'

export const COOKIES_REDUCER_ID = 'cookies'

export type State = Map<string, Map<string, Cookie>>

export default handleActions<State, *>(
  {
    [OPEN_COOKIE_BANNER]: (state: State, action: ActionType<Function>): State => {
      const { cookieBannerOpen } = action.payload

      return state.set('cookieBannerOpen', cookieBannerOpen)
    },
  },
  Map(),
)
