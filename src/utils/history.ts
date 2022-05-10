import { _getChainId } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { setChainId } from 'src/logic/config/utils'
import { extractPrefixedSafeAddress } from 'src/routes/routes'

export const setChainIdFromUrl = (pathname: string): boolean => {
  const { shortName, safeAddress } = extractPrefixedSafeAddress(pathname)

  if (!safeAddress) return false

  const chainId = getChains().find((chain) => chain.shortName === shortName)?.chainId

  if (chainId) {
    if (chainId !== _getChainId()) {
      setChainId(chainId)
    }
    return true
  }

  return false
}
