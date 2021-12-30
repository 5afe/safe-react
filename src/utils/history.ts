import { LocationDescriptorObject } from 'history'
import { getShortName } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { setChainId } from 'src/logic/config/utils'
import { hasPrefixedSafeAddressInUrl, extractPrefixedSafeAddress, history, WELCOME_ROUTE } from 'src/routes/routes'

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
    history.push(WELCOME_ROUTE)
    return
  }

  setChainId(chainId)
}
