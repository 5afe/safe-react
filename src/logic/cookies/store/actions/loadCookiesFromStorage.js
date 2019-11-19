// @flow
import type { Dispatch as ReduxDispatch } from 'redux'
import type { GlobalState } from '~/store'
import { loadFromStorage } from '~/utils/storage'
import { COOKIES_KEY } from '~/logic/cookies/utils/cookiesStorage'
import type { CookiesProps } from '~/logic/cookies/store/model/cookie'
import { setCookiesPermissions } from '~/logic/cookies/store/actions/setCookiesPermissions'

const loadCookiesFromStorage = () => async (dispatch: ReduxDispatch<GlobalState>) => {
  try {
    const cookies: ?{ [string]: CookiesProps } = await loadFromStorage(COOKIES_KEY)

    if (cookies) {
      dispatch(setCookiesPermissions(cookies))
    } else {
      dispatch(setCookiesPermissions({ acceptedAnalytics: false, acceptedNecessary: false }))
    }
  } catch (err) {
    // eslint-disable-next-line
    console.error('Error while getting cookies from storage:', err)
  }

  return Promise.resolve()
}

export default loadCookiesFromStorage
