// @flow
import { Map } from 'immutable'
import { handleActions, type ActionType } from 'redux-actions'
import type { Cookie } from '~/logic/cookies/store/model/cookie'
import { SET_COOKIES_PERMISSIONS } from '../actions/setCookiesPermissions'
import type { State } from '~/logic/tokens/store/reducer/tokens'

export const COOKIE_REDUCER_ID = 'cookies'

export type CookieReducerState = Map<string, Map<string, Cookie>>

export default handleActions<State, *>(
  {
    [SET_COOKIES_PERMISSIONS]: (state: State, action: ActionType<Function>): State => {
      const { acceptedNecessary, acceptedAnalytics } = action.payload

      const newState = state.withMutations((mutableState) => {
        mutableState.set('acceptedNecessary', acceptedNecessary)
        mutableState.set('acceptedAnalytics', acceptedAnalytics)
      })
      return newState
    },
  },
  Map(),
)
