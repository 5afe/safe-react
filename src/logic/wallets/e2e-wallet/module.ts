import HDWalletProvider from '@truffle/hdwallet-provider'
import { WalletModule } from 'bnc-onboard/dist/src/interfaces'
import { getRpcServiceUrl } from 'src/config'
import CypressLogo from 'src/assets/icons/cypress_logo.svg'

const WALLET_NAME = 'E2E Wallet'

const getE2EWalletModule = (): WalletModule => {
  return {
    name: WALLET_NAME,
    type: 'injected',
    iconSrc: CypressLogo,
    wallet: async (helpers) => {
      const { createModernProviderInterface } = helpers
      const provider = new HDWalletProvider({
        mnemonic: window.Cypress.env('CYPRESS_MNEMONIC'),
        providerOrUrl: getRpcServiceUrl(),
      })
      return {
        provider,
        interface: createModernProviderInterface(provider),
      }
    },
    desktop: true,
    mobile: true,
  }
}

export default getE2EWalletModule
