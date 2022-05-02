import { IClientMeta } from '@walletconnect/types'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import UAParser from 'ua-parser-js'

import { APP_VERSION, PUBLIC_URL } from 'src/utils/constants'
import { ChainId } from 'src/config/chain'
import { getWCWalletInterface, getWalletConnectProvider } from 'src/logic/wallets/walletConnect/utils'

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

// Note: this shares a lot of similarities with the patchedWalletConnect module
const getPairingModule = (chainId: ChainId): WalletModule => {
  const STORAGE_ID = 'SAFE__pairingProvider'
  const clientMeta = getClientMeta()

  return {
    name: PAIRING_MODULE_NAME,
    wallet: async ({ resetWalletState }) => {
      const provider = getWalletConnectProvider(chainId, {
        storageId: STORAGE_ID,
        qrcode: false, // Don't show QR modal
        clientMeta,
      })

      // WalletConnect overrides the clientMeta, so we need to set it back
      ;(provider.wc as any).clientMeta = clientMeta
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
          ...getWCWalletInterface(provider),
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
