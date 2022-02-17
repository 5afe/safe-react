export const COOKIES_KEY = 'COOKIES'
export const COOKIES_KEY_INTERCOM = `${COOKIES_KEY}_INTERCOM`

export enum COOKIE_IDS {
  INTERCOM = 'INTERCOM',
  BEAMER = 'BEAMER',
}

export const COOKIE_ALERTS: Record<COOKIE_IDS, string> = {
  INTERCOM: 'You attempted to open the customer support chat. Please accept the community support & updates cookies',
  BEAMER: "You attempted to open the What's New section. Please accept the community support & updates cookies.",
}

export type BannerCookiesType = {
  acceptedNecessary: boolean
  acceptedSupportAndUpdates: boolean
  acceptedAnalytics: boolean
}
export type IntercomCookieType = {
  userId: string
}
