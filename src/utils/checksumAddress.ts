// import { getNetworkId } from 'src/config'
// import { getWeb3 } from 'src/logic/wallets/getWeb3'

// const rskjUtils = require('rskjs-util')

export const checksumAddress = (address) => {
  if (!address) return null
  // const chainId = getNetworkId();
  // return rskjUtils.toChecksumAddress(address, chainId)
  return address.toLowerCase()
}
