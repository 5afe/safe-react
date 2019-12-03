// @flow
import type { Provider } from '~/logic/wallets/store/model/provider'
import { COOKIES_REDUCER_ID } from '~/logic/cookies/store/reducer/cookies'

export const cookieBannerOpen = (state: any): Provider => state[COOKIES_REDUCER_ID].get('cookieBannerOpen')
