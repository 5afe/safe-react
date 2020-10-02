import Cookies from 'js-cookie'

import { getNetworkId } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'

const PREFIX = `v1_${ETHEREUM_NETWORK[getNetworkId()]}`

export const loadFromCookie = async (key) => {
  try {
    const stringifiedValue = await Cookies.get(`${PREFIX}__${key}`)
    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    console.error(`Failed to load ${key} from cookies:`, err)
    return undefined
  }
}

export const saveCookie = async (key, value, expirationDays) => {
  try {
    const stringifiedValue = JSON.stringify(value)
    const expiration = expirationDays ? { expires: expirationDays } : undefined
    await Cookies.set(`${PREFIX}__${key}`, stringifiedValue, expiration)
  } catch (err) {
    console.error(`Failed to save ${key} in cookies:`, err)
  }
}
