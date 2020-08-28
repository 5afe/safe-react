import { COOKIES_REDUCER_ID } from 'src/logic/cookies/store/reducer/cookies'

export const cookieBannerOpen = (state) => state[COOKIES_REDUCER_ID].get('cookieBannerOpen')
