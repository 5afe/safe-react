import WalletConnectProvider from '@walletconnect/web3-provider'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'

import { _getChainId, getRpcServiceUrl } from 'src/config'
import { setPairingUri, setPairingState } from 'src/logic/pairing/actions'
import { initialPairingState } from 'src/logic/pairing/reducer'
import { store } from 'src/store'
import { PUBLIC_URL } from 'src/utils/constants'

// Modified version of the built in WC module in onboard
// https://github.com/blocknative/onboard/blob/release/1.35.5/src/modules/select/wallets/wallet-connect.ts
export const PAIRING_MODULE_NAME = 'Mobile Safe'
const getPairingModule = (): WalletModule => {
  return {
    name: PAIRING_MODULE_NAME,
    iconSrc: `${PUBLIC_URL}/resources/safe.png`,
    wallet: async (helpers) => {
      const chainId = _getChainId()

      const provider = new WalletConnectProvider({
        rpc: { [chainId]: getRpcServiceUrl() },
        chainId: parseInt(_getChainId(), 10),
        bridge: 'https://safe-walletconnect.gnosis.io/',
        storageId: 'SAFE__pairingProvider',
        qrcode: false, // Don't show QR modal
      })

      // Not sure if redundant, but just in case
      provider.autoRefreshOnNetworkChange = false

      provider.connector.on('display_uri', (_err, payload) => {
        const uri = payload.params[0]
        store.dispatch(setPairingUri(uri))
      })

      provider.wc.on('connect', () => {
        store.dispatch(setPairingState({ uri: '', isPaired: true }))
      })

      provider.wc.on('disconnect', () => {
        store.dispatch(setPairingState(initialPairingState))
        helpers.resetWalletState({ disconnected: true, walletName: PAIRING_MODULE_NAME })
      })

      provider.enable()

      if (provider.connected) {
        store.dispatch(setPairingState({ uri: provider.wc.uri, isPaired: true }))
      }

      return {
        provider,
        interface: {
          name: PAIRING_MODULE_NAME,
          // Trigger onboard 'connect' checkName
          connect: () => Promise.resolve(undefined),
          address: {
            onChange: (updater) => {
              provider.send('eth_accounts').then(([account]: string[]) => {
                if (account) {
                  updater(account)
                }
              })
              provider.on('accountsChanged', ([account]: string[]) => updater(account))
            },
          },
          network: {
            onChange: (updater) => {
              provider.send('eth_chainId').then(updater)
              provider.on('chainChanged', updater)
            },
          },
          balance: {
            // FIXME: Seems to cause listener memory leak
            // get: async () => {
            //   const account = provider.wc.accounts[0]
            //   if (!account) {
            //     return null
            //   }
            //   return helpers.getBalance(provider, account)
            // },
          },
          disconnect: () => {
            provider.wc.killSession()
            provider.stop()
          },
        },
      }
    },
    type: 'sdk',
    desktop: true,
    preferred: true,
  }
}

export default getPairingModule
