import WalletConnectProvider from '@walletconnect/web3-provider'
import { IClientMeta } from '@walletconnect/types'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import UAParser from 'ua-parser-js'

import { APP_VERSION, PUBLIC_URL } from 'src/utils/constants'
import { ChainId } from 'src/config/chain.d'
import { getWCWalletInterface, getWalletConnectProvider } from 'src/logic/wallets/walletConnect/utils'
import onboard from 'src/logic/wallets/onboard'
import { _getChainId } from 'src/config'

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

const createPairingProvider = (chainId: ChainId): WalletConnectProvider => {
  const STORAGE_ID = 'SAFE__pairingProvider'
  const clientMeta = getClientMeta()

  // Provider is enabled as/when needed in `PairingDetails.tsx`
  const provider = getWalletConnectProvider(chainId, {
    storageId: STORAGE_ID,
    qrcode: false, // Don't show QR modal
    clientMeta,
  })

  // WalletConnect overrides the clientMeta, so we need to set it back
  ;(provider.wc as any).clientMeta = clientMeta
  ;(provider.wc as any)._clientMeta = clientMeta

  // If previous session reconnects, update onboard
  provider.on('connect', () => {
    onboard().walletSelect(PAIRING_MODULE_NAME)
  })

  const onDisconnect = () => {
    onboard().walletReset()
  }

  provider.wc.on('disconnect', onDisconnect)

  window.addEventListener('unload', onDisconnect, { once: true })

  return provider
}

let _pairingProvider: WalletConnectProvider | undefined

export const getPairingProvider = (): WalletConnectProvider => {
  // We cannot initialize provider immediately as we need to wait for chains to load RPCs
  if (!_pairingProvider) {
    // Successful pairing does not use chainId of provider but that of the pairee
    // so we can use any chainId here and it need not be updated
    _pairingProvider = createPairingProvider(_getChainId())
  }
  return _pairingProvider
}

// Note: this shares a lot of similarities with the patchedWalletConnect module
const getPairingModule = (): WalletModule => {
  const name = PAIRING_MODULE_NAME
  const provider = getPairingProvider()
  return {
    name,
    wallet: async () => ({
      provider,
      interface: {
        ...getWCWalletInterface(provider),
        name,
      },
    }),
    type: 'sdk',
    desktop: true,
    mobile: false,
    // Must be preferred to position 1st in list (to hide via CSS)
    preferred: true,
  }
}

export default getPairingModule
