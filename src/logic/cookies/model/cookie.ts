export type BannerCookiesType = {
  acceptedNecessary: boolean
  acceptedIntercom: boolean
  acceptedAnalytics: boolean
}
export type IntercomCookieType = {
  userId: string
}
export const COOKIES_KEY = 'COOKIES'
export const COOKIES_KEY_INTERCOM = `${COOKIES_KEY}_INTERCOM`
