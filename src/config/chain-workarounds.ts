import { ETHEREUM_NETWORK } from './networks/network.d'

// How much to add to gasLimit per network
// Defaults to 1 (i.e. no extra gas)
export const EXTRA_GAS_FACTOR = {
  [ETHEREUM_NETWORK.ARBITRUM]: 1.2, // +20%
  [ETHEREUM_NETWORK.XDAI]: 1.7, // +70%
}

// Networks where we use maxFeePerGas
export const EIP1559Chains = [ETHEREUM_NETWORK.MAINNET, ETHEREUM_NETWORK.RINKEBY, ETHEREUM_NETWORK.XDAI]
