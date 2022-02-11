import { IClientMeta } from '@walletconnect/types'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import UAParser from 'ua-parser-js'

import { APP_VERSION } from 'src/utils/constants'
import { ChainId } from 'src/config/chain'
import { getPairingUri } from 'src/logic/wallets/pairing/utils'
import { getWCWalletInterface, getWalletConnectProvider } from 'src/logic/wallets/walletConnect/utils'

// Modified version of the built in WC module in Onboard v1.35.5
// https://github.com/blocknative/onboard/blob/release/1.35.5/src/modules/select/wallets/wallet-connect.ts

export const PAIRING_MODULE_NAME = 'Mobile'

let client = ''
const getClientMeta = (): IClientMeta => {
  // Only instantiate parser if no app or client is set
  if (!client) {
    const parser = new UAParser()
    const browser = parser.getBrowser()
    const os = parser.getOS()

    client = `${browser.name} ${browser.major} (${os.name} ${os.version})`
  }

  const app = `Safe Web App ${APP_VERSION}`

  return {
    name: PAIRING_MODULE_NAME,
    description: [app, client].join(';'),
    url: 'https://gnosis-safe.io/app',
    icons: [],
  }
}

// Note: this shares a lot of similarities with the patchedWalletConnect module
const getPairingModule = (chainId: ChainId): WalletModule => {
  const STORAGE_ID = 'SAFE__pairingProvider'

  return {
    name: PAIRING_MODULE_NAME,
    wallet: async ({ resetWalletState }) => {
      const provider = getWalletConnectProvider(chainId, {
        storageId: STORAGE_ID,
        qrcode: false, // Don't show QR modal
        clientMeta: getClientMeta(),
      })

      provider.wc.on('disconnect', () => {
        resetWalletState({ disconnected: true, walletName: PAIRING_MODULE_NAME })
      })

      provider.wc.on('display_uri', (_, { params }: { params: string[] }) => {
        console.log(getPairingUri(params[0]))
      })

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
