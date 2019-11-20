// @flow
import { Map } from 'immutable'
import { createAction } from 'redux-actions'
import type { Cookie, CookiesProps } from '~/logic/cookies/store/model/cookie'

export const SET_COOKIES_PERMISSIONS = 'SET_COOKIES_PERMISSIONS'


// eslint-disable-next-line max-len
export const setCookiesPermissions = createAction<string, *>(SET_COOKIES_PERMISSIONS, (cookies: Map<string, Cookie>): CookiesProps => cookies)
