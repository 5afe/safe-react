import { ETHEREUM_NETWORK } from '../logic/wallets/getWeb3'
import { NetworkConfig } from './networks/network'
import mainnet from './networks/mainnet'

// @todo (agustin) add missing configs
export const getNetworkConfig = (network: ETHEREUM_NETWORK): NetworkConfig | null => {

  switch(network) {
    case ETHEREUM_NETWORK.MAINNET: {
      return mainnet
    }
    case ETHEREUM_NETWORK.RINKEBY: {
      break
    }
    case ETHEREUM_NETWORK.KOVAN: {
      break
    }
    case ETHEREUM_NETWORK.ROPSTEN: {
      break
    }
    case ETHEREUM_NETWORK.GOERLI: {
      break
    }
    case ETHEREUM_NETWORK.ENERGY_WEB_CHAIN: {
      break
    }
    case ETHEREUM_NETWORK.MORDEN: {
      break
    }
    case ETHEREUM_NETWORK.VOLTA: {
      break
    }
    case ETHEREUM_NETWORK.UNKNOWN: {
      break
    }
  }

  return null
}




