import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import onboard from 'src/logic/wallets/onboard'
import { getConfig, getNetworkId, getRpcServiceUrl } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { numberToHex } from 'web3-utils'

const WALLET_ERRORS = {
  UNRECOGNIZED_CHAIN: 4902,
  USER_REJECTED: 4001,
  // ADDING_EXISTING_CHAIN: -32603,
}

/**
 * Switch the chain assuming it's MetaMask.
 * @see https://github.com/MetaMask/metamask-extension/pull/10905
 */
const requestSwitch = async (wallet: Wallet, chainId: ETHEREUM_NETWORK): Promise<void> => {
  await wallet.provider.request({
    method: 'wallet_switchEthereumChain',
    params: [
      {
        chainId: numberToHex(chainId),
      },
    ],
  })
}

/**
 * Add a chain config based on EIP-3085.
 * Known to be implemented by MetaMask.
 * @see https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
 */
const requestAdd = async (wallet: Wallet, chainId: ETHEREUM_NETWORK): Promise<void> => {
  const cfg = getConfig()

  await wallet.provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: numberToHex(chainId),
        chainName: cfg.network.label,
        nativeCurrency: {
          name: cfg.network.nativeCoin.name,
          symbol: cfg.network.nativeCoin.symbol,
          decimals: cfg.network.nativeCoin.decimals,
        },
        rpcUrls: [getRpcServiceUrl()],
        blockExplorerUrls: [cfg.networkExplorerUrl],
      },
    ],
  })
}

/**
 * Try switching the wallet chain, and if it fails, try adding the chain config
 */
export const switchNetwork = async (wallet: Wallet, chainId: ETHEREUM_NETWORK): Promise<void> => {
  try {
    await requestSwitch(wallet, chainId)
  } catch (e) {
    if (e.code === WALLET_ERRORS.USER_REJECTED) {
      return
    }

    if (e.code == WALLET_ERRORS.UNRECOGNIZED_CHAIN) {
      try {
        await requestAdd(wallet, chainId)
      } catch (e) {
        if (e.code === WALLET_ERRORS.USER_REJECTED) {
          return
        }

        throw new CodedException(Errors._301, e.message)
      }
    } else {
      throw new CodedException(Errors._300, e.message)
    }
  }
}

export const shouldSwitchNetwork = (wallet = onboard().getState()?.wallet): boolean => {
  const desiredNetwork = getNetworkId()
  const currentNetwork = wallet?.provider?.networkVersion
  return currentNetwork ? desiredNetwork !== currentNetwork.toString() : false
}

export const canSwitchNetwork = (wallet = onboard().getState()?.wallet): boolean => {
  return wallet?.provider?.isMetaMask || false
}
