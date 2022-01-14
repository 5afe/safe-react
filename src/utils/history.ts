import { _getChainId } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { setChainId } from 'src/logic/config/utils'
import { hasPrefixedSafeAddressInUrl, extractPrefixedSafeAddress } from 'src/routes/routes'

export const setChainIdFromUrl = (pathname: string): boolean => {
  if (!hasPrefixedSafeAddressInUrl()) return false

  const { shortName } = extractPrefixedSafeAddress(pathname)
  const chainId = getChains().find((chain) => chain.shortName === shortName)?.chainId

  if (chainId) {
    if (chainId !== _getChainId()) {
      setChainId(chainId)
    }
    return true
  }

  return false
}
