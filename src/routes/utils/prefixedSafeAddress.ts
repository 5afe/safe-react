import { matchPath } from 'react-router-dom'

import { getConfig, getNetworkId, getNetworkConfigById, getNetworks } from 'src/config'
import { SafeRouteSlugs, SAFE_ROUTE, history, SAFE_ADDRESS_SLUG } from 'src/routes/newroutes'
import { PUBLIC_URL } from 'src/utils/constants'
import { isValidAddress } from 'src/utils/isValidAddress'
import { sameString } from 'src/utils/strings'

const isValidShortChainName = (shortName: string) => {
  const shortNames = getNetworks().map(({ shortName }) => shortName)
  return shortNames.some((name) => sameString(name, shortName))
}

const isValidChainSpecificAddress = (chainSpecificAddress: string) => {
  const parts = chainSpecificAddress?.split(':')?.filter(Boolean)

  if (parts?.length === 2) {
    const [shortName, address] = parts
    return isValidShortChainName(shortName) && isValidAddress(address)
  } else {
    return false
  }
}

// TODO: Some of these should likely go into config file
const getCurrentShortChainName = (): string => getConfig().network.shortName

export const getShortChainNameById = (networkId = getNetworkId()): string => {
  const cfg = getNetworkConfigById(networkId)
  return cfg?.network?.shortName || getCurrentShortChainName()
}

const getPrefixedSafeAddressFromUrl = (): { shortName: string; safeAddress: string } => {
  const chainSpecificAddress = history.location.pathname
    .split('/')
    .filter((dir) => Boolean(dir) && dir !== PUBLIC_URL)?.[0]

  const [shortName = '', safeAddress = ''] = chainSpecificAddress

  return { shortName, safeAddress }
}
const getShortChainNameFromUrl = (): string => {
  const { shortName } = getPrefixedSafeAddressFromUrl()
  return isValidShortChainName(shortName) ? shortName : getCurrentShortChainName()
}
const getSafeAddressFromUrl = (): string => getPrefixedSafeAddressFromUrl().safeAddress

export const getPrefixedSafeAddressSlug = (): string => {
  const match = matchPath<SafeRouteSlugs>(history.location.pathname, {
    path: SAFE_ROUTE,
  })

  if (match && isValidChainSpecificAddress(match.params?.[SAFE_ADDRESS_SLUG])) {
    return match.params[SAFE_ADDRESS_SLUG]
  }

  const shortName = getShortChainNameFromUrl() || getCurrentShortChainName()
  const address = getSafeAddressFromUrl()

  return `${shortName}:${address}`
}
