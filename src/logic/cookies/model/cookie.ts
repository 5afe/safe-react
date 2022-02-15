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

type cookiesWarningTypes = 'customerSupport' | 'whatsNew'
type warningPropsType = {
  clickedLabel: string
  cookieType: string
}

export const warningProps: Record<cookiesWarningTypes, warningPropsType> = {
  customerSupport: {
    clickedLabel: 'customer support chat',
    cookieType: 'customer support cookie',
  },
  whatsNew: { clickedLabel: "What's New", cookieType: 'analytics cookies' },
}
