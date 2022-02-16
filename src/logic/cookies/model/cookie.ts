export const COOKIES_KEY = 'COOKIES'
export const COOKIES_KEY_INTERCOM = `${COOKIES_KEY}_INTERCOM`

export enum COOKIE_IDS {
  INTERCOM = 'INTERCOM',
  BEAMER = 'BEAMER',
}

export const COOKIE_ALERTS: Record<COOKIE_IDS, string> = {
  INTERCOM: 'You attempted to open the customer support chat. Please accept the customer support cookie',
  BEAMER: "You attempted to open the What's New. Please accept the analytics cookies.",
}

export type BannerCookiesType = {
  acceptedNecessary: boolean
  acceptedIntercom: boolean
  acceptedAnalytics: boolean
}
export type IntercomCookieType = {
  userId: string
}
