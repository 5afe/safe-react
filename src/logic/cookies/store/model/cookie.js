// @flow
import type { RecordOf } from 'immutable'

export type CookiesProps = {
  acceptedNecessary: boolean;
  acceptedAnalytics: boolean;
}

export type Cookie = RecordOf<CookiesProps>
