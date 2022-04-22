import WalletConnectProvider from '@walletconnect/web3-provider'
import { IRPCMap, IWalletConnectProviderOptions } from '@walletconnect/types'
import { WalletInterface } from 'bnc-onboard/dist/src/interfaces'

import { getRpcServiceUrl } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { ChainId } from 'src/config/chain'
import { INFURA_TOKEN } from 'src/utils/constants'

type Options = Omit<IWalletConnectProviderOptions, 'bridge' | 'infuraId' | 'rpc' | 'chainId' | 'pollingInterval'>

export const getWalletConnectProvider = (chainId: ChainId, options: Options = {}): WalletConnectProvider => {
  const WC_BRIDGE = 'https://safe-walletconnect.gnosis.io/'
  // Prevent `eth_getBlockByNumber` polling every 4 seconds
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/357#issuecomment-789663540
  const POLLING_INTERVAL = 60_000 * 60 // 1 hour
  const RPC_MAP: IRPCMap = getChains().reduce((map, { chainId, rpcUri }) => {
    return {
      ...map,
      [parseInt(chainId, 10)]: getRpcServiceUrl(rpcUri),
    }
  }, {})

  const provider = new WalletConnectProvider({
    bridge: WC_BRIDGE,
    pollingInterval: POLLING_INTERVAL,
    infuraId: INFURA_TOKEN,
    rpc: RPC_MAP,
    chainId: parseInt(chainId, 10),
    // Prevent `eth_getBlockByNumber` polling every 4 seconds
    ...options,
  })

  provider.autoRefreshOnNetworkChange = false

  return provider
}

export const getWCWalletInterface = (
  provider: WalletConnectProvider,
): Pick<WalletInterface, 'address' | 'network' | 'balance' | 'disconnect'> => {
  return {
    address: {
      onChange: (func) => {
        provider.send('eth_accounts').then((accounts: string[]) => accounts[0] && func(accounts[0]))
        provider.on('accountsChanged', (accounts: string[]) => func(accounts[0]))
      },
    },
    network: {
      onChange: (func) => {
        provider.send('eth_chainId').then(func)
        provider.on('chainChanged', func)
      },
    },
    // balance stateSynce prevents continuous `eth_getBalance` requests
    // (prevents us from accessing balance via Onboard, but via web3 works)
    balance: {},
    disconnect: () => {
      // Only disconnect if connected
      if (provider.wc.peerId) {
        provider.disconnect()
      }
    },
  }
}
