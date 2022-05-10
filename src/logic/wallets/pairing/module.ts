import WalletConnectProvider from '@walletconnect/web3-provider'
import { IClientMeta, IRPCMap } from '@walletconnect/types'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import UAParser from 'ua-parser-js'

import { APP_VERSION, INFURA_TOKEN, PUBLIC_URL, WC_BRIDGE } from 'src/utils/constants'
import { ChainId } from 'src/config/chain'
import { getRpcServiceUrl } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { BLOCK_POLLING_INTERVAL } from '../onboard'

// Modified version of the built in WC module in Onboard v1.35.5
// https://github.com/blocknative/onboard/blob/release/1.35.5/src/modules/select/wallets/wallet-connect.ts

export const PAIRING_MODULE_NAME = 'Safe Mobile'

let client = ''
const getClientMeta = (): IClientMeta => {
  // Only instantiate parser if no app or client is set
  if (!client) {
    const parser = new UAParser()
    const browser = parser.getBrowser()
    const os = parser.getOS()

    client = `${browser.name} ${browser.major} (${os.name})`
  }

  const app = `Safe Web v${APP_VERSION}`
  const logo = `${location.origin}${PUBLIC_URL}/resources/logo_120x120.png`

  return {
    name: app,
    description: `${client};${app}`,
    url: 'https://gnosis-safe.io/app',
    icons: [logo],
  }
}

const getPairingModule = (chainId: ChainId): WalletModule => {
  const STORAGE_ID = 'SAFE__pairingProvider'
  const clientMeta = getClientMeta()

  return {
    name: PAIRING_MODULE_NAME,
    wallet: async ({ resetWalletState }) => {
      const RPC_MAP: IRPCMap = getChains().reduce((map, { chainId, rpcUri }) => {
        return {
          ...map,
          [parseInt(chainId, 10)]: getRpcServiceUrl(rpcUri),
        }
      }, {})

      const provider = new WalletConnectProvider({
        bridge: WC_BRIDGE,
        pollingInterval: BLOCK_POLLING_INTERVAL,
        infuraId: INFURA_TOKEN,
        rpc: RPC_MAP,
        chainId: parseInt(chainId, 10),
        storageId: STORAGE_ID,
        qrcode: false, // Don't show QR modal
        clientMeta,
      })

      provider.autoRefreshOnNetworkChange = false

      // WalletConnect overrides the clientMeta, so we need to set it back(provider.wc as any).clientMeta = clientMeta
      ;(provider.wc as any)._clientMeta = clientMeta

      const onDisconnect = () => {
        resetWalletState({ disconnected: true, walletName: PAIRING_MODULE_NAME })
      }

      provider.wc.on('disconnect', onDisconnect)

      window.addEventListener('unload', onDisconnect, { once: true })

      // Establish WC connection
      provider.enable()

      return {
        provider,
        interface: {
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
          // We never request balance from onboard
          balance: {},
          disconnect: () => {
            // Only disconnect if connected
            if (provider.wc.peerId) {
              provider.disconnect()
            }
          },
          name: PAIRING_MODULE_NAME,
        },
      }
    },
    type: 'sdk',
    desktop: true,
    mobile: false,
    // Must be preferred to position 1st in list (to hide via CSS)
    preferred: true,
  }
}

export default getPairingModule
