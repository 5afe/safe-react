// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import type { GlobalState } from '~/store'
import type { CookiesProps } from '~/logic/cookies/store/model/cookie'
import { setCookiesPermissions } from '~/logic/cookies/store/actions/setCookiesPermissions'
import { saveToStorage } from '~/utils/storage'
import { COOKIES_KEY } from '~/logic/cookies/utils/cookiesStorage'

const saveCookiesToStorage = (cookies: CookiesProps) => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    await saveToStorage(COOKIES_KEY, cookies)
    dispatch(setCookiesPermissions(cookies))
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error saving cookies to the localStorage:', err)
  }

  return Promise.resolve()
}

export default saveCookiesToStorage
