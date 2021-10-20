import { LocationDescriptorObject } from 'history'
import { getCurrentShortChainName, getNetworkIdByShortChainName } from 'src/config'
import { setNetwork } from 'src/logic/config/utils'
import { hasPrefixedSafeAddressInUrl, extractPrefixedSafeAddress } from 'src/routes/routes'

export const switchNetworkWithUrl = ({ pathname }: LocationDescriptorObject): void => {
  if (!hasPrefixedSafeAddressInUrl()) return

  const { shortName } = extractPrefixedSafeAddress(pathname)
  const currentShortName = getCurrentShortChainName()

  if (shortName === currentShortName) return

  const networkId = getNetworkIdByShortChainName(shortName)
  setNetwork(networkId)
}
