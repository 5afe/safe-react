import WalletConnectProvider from '@walletconnect/web3-provider'
import { IClientMeta } from '@walletconnect/types'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import UAParser from 'ua-parser-js'

import { APP_VERSION, INFURA_TOKEN, PUBLIC_URL, WC_BRIDGE } from 'src/utils/constants'
import { getRpcServiceUrl, _getChainId } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import onboard, { BLOCK_POLLING_INTERVAL } from '../onboard'

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

const createPairingProvider = (): WalletConnectProvider => {
  const STORAGE_ID = 'SAFE__pairingProvider'

  const rpc = getChains().reduce((map, { chainId, rpcUri }) => {
    return {
      ...map,
      [parseInt(chainId, 10)]: getRpcServiceUrl(rpcUri),
    }
  }, {})
  const clientMeta = getClientMeta()

  const provider = new WalletConnectProvider({
    bridge: WC_BRIDGE,
    pollingInterval: BLOCK_POLLING_INTERVAL,
    infuraId: INFURA_TOKEN,
    rpc,
    chainId: parseInt(_getChainId(), 10),
    storageId: STORAGE_ID,
    qrcode: false, // Don't show QR modal
    clientMeta,
  })

  // WalletConnect overrides the clientMeta, so we need to set it back
  ;(provider.wc as any).clientMeta = clientMeta
  ;(provider.wc as any)._clientMeta = clientMeta

  provider.autoRefreshOnNetworkChange = false

  provider.wc.on('disconnect', () => {
    provider.wc.createSession()
  })

  provider.wc.on('connect', () => {
    onboard().walletSelect(PAIRING_MODULE_NAME)
  })

  return provider
}

let _pairingProvider: WalletConnectProvider | undefined

export const getPairingProvider = (): WalletConnectProvider => {
  // We cannot initialize provider immediately as we need to wait for chains to load RPCs
  if (!_pairingProvider) {
    _pairingProvider = createPairingProvider()
  }
  return _pairingProvider
}

const getPairingModule = (): WalletModule => {
  const name = PAIRING_MODULE_NAME
  const provider = getPairingProvider()

  return {
    name,
    wallet: async ({ resetWalletState }) => {
      // Enable provider when a previously interrupted session exists
      if (provider.wc.session.connected) {
        provider.enable()
      }

      const onDisconnect = () => resetWalletState({ walletName: name, disconnected: true })

      provider.wc.on('disconnect', onDisconnect)
      provider.wc.on('wc_sessionUpdate', (_, { params }) => {
        // Mobile revokes session upon disconnection
        const didMobileDisconnect = params[0]?.approved === false
        if (didMobileDisconnect) {
          onDisconnect
        }
      })

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
          // We never access the balance via onboard
          balance: {},
          disconnect: () => {
            // Only disconnect if connected
            if (provider.wc.peerId) {
              provider.disconnect()
            }
          },
          name,
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
