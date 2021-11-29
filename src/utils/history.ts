import { LocationDescriptorObject } from 'history'
import { getShortName, setChainId, getChains } from 'src/config'
import { hasPrefixedSafeAddressInUrl, extractPrefixedSafeAddress } from 'src/routes/routes'

export const switchNetworkWithUrl = ({ pathname }: LocationDescriptorObject): void => {
  if (!hasPrefixedSafeAddressInUrl()) {
    return
  }

  const { shortName } = extractPrefixedSafeAddress(pathname)
  const currentShortName = getShortName()

  if (shortName === currentShortName) {
    return
  }

  const chainId = getChains().find((chain) => chain.shortName === shortName)?.chainId

  if (!chainId) {
    return
  }

  setChainId(chainId)
}
