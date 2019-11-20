// @flow
import { type GlobalState } from '~/store'
import { COOKIE_REDUCER_ID } from '~/logic/cookies/store/reducer/cookies'


export const cookiesSelector = (state: GlobalState) => state[COOKIE_REDUCER_ID]
