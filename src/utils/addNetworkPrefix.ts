import { extractShortChainName } from 'src/routes/routes'
import getNetworkPrefix from './getNetworkPrefix'

function addNetworkPrefix(address = '', showNetworkPrefix = true, netWorkPrefix = extractShortChainName()): string {
  // if showNetworkPrefix is disabled in appearance settings we return the address as it is
  if (!showNetworkPrefix) {
    return address
  }

  const prefix = getNetworkPrefix(address)

  // if no prefix is present in the provided address we return the prefixed address
  if (!prefix && address) {
    const prefixedAddress = `${netWorkPrefix}:${address}`
    return prefixedAddress
  }

  return address
}

export default addNetworkPrefix
