import { CookieState, COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'
import { AppReduxState } from 'src/store'

export const cookieBannerState = (state: AppReduxState): CookieState => state[COOKIES_REDUCER_ID]
