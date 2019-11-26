// @flow
import type { RecordOf } from 'immutable'

export const COOKIES_KEY = 'COOKIES'

export type CookiesProps = {
  acceptedNecessary: boolean,
  acceptedAnalytics: boolean,
}

export type Cookie = RecordOf<CookiesProps>
