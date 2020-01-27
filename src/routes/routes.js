// @flow
import { history } from '~/safeStore'

export const SAFE_PARAM_ADDRESS = 'address'
export const SAFELIST_ADDRESS = '/safes'
export const OPEN_ADDRESS = '/open'
export const LOAD_ADDRESS = '/load'
export const WELCOME_ADDRESS = '/welcome'
export const OPENING_ADDRESS = '/opening'

export const stillInOpeningView = () => {
  const path = history.location.pathname
  return path === OPENING_ADDRESS
}
