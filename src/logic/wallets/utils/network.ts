import WalletConnect from '@walletconnect/client'
import { numberToHex } from 'web3-utils'

import { getChainInfo, getExplorerUrl, getPublicRpcUrl, _getChainId } from 'src/config'
import { ChainId } from 'src/config/chain.d'
import { Errors, CodedException } from 'src/logic/exceptions/CodedException'
import { isPairingWallet } from 'src/logic/wallets/pairing/utils'
import { WalletState } from '@web3-onboard/core'
import { getOnboardInstance, getOnboardState } from '../onboard'
import { getPairingConnector } from '../pairing'

const WALLET_ERRORS = {
  UNRECOGNIZED_CHAIN: 4902,
  USER_REJECTED: 4001,
  // ADDING_EXISTING_CHAIN: -32603,
}

/**
 * Switch the chain assuming it's MetaMask.
 * @see https://github.com/MetaMask/metamask-extension/pull/10905
 */
const requestSwitch = async (wallet: WalletState, chainId: ChainId): Promise<void> => {
  // Note: This could support WC too
  if (isPairingWallet(wallet.label)) {
    const connector =
      ((wallet.provider as any)?.connector as InstanceType<typeof WalletConnect>) || getPairingConnector()
    connector.updateSession({
      chainId: parseInt(chainId, 10),
      accounts: connector.accounts,
    })
  } else {
    await wallet.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: numberToHex(chainId),
        },
      ],
    })
  }
}

/**
 * Add a chain config based on EIP-3085.
 * Known to be implemented by MetaMask.
 * @see https://docs.metamask.io/guide/rpc-api.html#wallet-addethereumchain
 */
const requestAdd = async (wallet: WalletState, chainId: ChainId): Promise<void> => {
  const { chainName, nativeCurrency } = getChainInfo()

  await wallet.provider?.request({
    // @ts-expect-error 'wallet_addEthereumChain' method is not in web3-onboard types
    method: 'wallet_addEthereumChain',
    params: [
      // @ts-expect-error 'wallet_addEthereumChain' method is not in web3-onboard types
      {
        chainId: numberToHex(chainId),
        chainName,
        nativeCurrency,
        rpcUrls: [getPublicRpcUrl()],
        blockExplorerUrls: [getExplorerUrl()],
      },
    ],
  })
}

/**
 * Try switching the wallet chain, and if it fails, try adding the chain config
 */
export const switchNetwork = async (wallet: WalletState, chainId: ChainId): Promise<void> => {
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

export const shouldSwitchNetwork = (wallet: WalletState): boolean => {
  // The current network can be stored under one of two keys
  // @ts-expect-error chainId key is not standardized
  const isCurrentNetwork = [wallet?.provider?.networkVersion, wallet?.provider?.chainId].some(
    (chainId) => chainId && chainId.toString() !== _getChainId(),
  )

  return isCurrentNetwork
}

export const switchWalletChain = async (): Promise<void> => {
  const { wallet } = getOnboardState()
  try {
    await switchNetwork(wallet, _getChainId())
  } catch (e) {
    e.log()
    await getOnboardInstance().connectWallet()
  }
}
