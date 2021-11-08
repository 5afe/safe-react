import { getCurrentShortChainName } from 'src/config'
import getNetworkPrefix from './getNetworkPrefix'

function addNetworkPrefix(
  address = '',
  showNetworkPrefix = true,
  netWorkPrefix: string = getCurrentShortChainName(),
): string {
  // if showNetworkPrefix is disabled in appearance settings we return the address as it is
  if (!showNetworkPrefix) {
    return address
  }

  const prefix = getNetworkPrefix(address)

  // if no prefix is present in the provided address we return the prefixed address
  if (!prefix && address) {
    const prefixedAddress = `${netWorkPrefix}${address.includes(':') ? '' : ':'}${address}`
    return prefixedAddress
  }

  return address
}

export default addNetworkPrefix
