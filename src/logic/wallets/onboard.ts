import Onboard from 'bnc-onboard'
import { API, Initialization } from 'bnc-onboard/dist/src/interfaces'

import { _getChainId, getChainName } from 'src/config'
import { getWeb3, setWeb3, isSmartContractWallet } from 'src/logic/wallets/getWeb3'
import transactionDataCheck from './transactionDataCheck'
import { getSupportedWallets } from './utils/walletList'
import { ChainId, CHAIN_ID } from 'src/config/chain.d'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { store } from 'src/store'
import updateProviderWallet from 'src/logic/wallets/store/actions/updateProviderWallet'
import updateProviderAccount from 'src/logic/wallets/store/actions/updateProviderAccount'
import updateProviderNetwork from 'src/logic/wallets/store/actions/updateProviderNetwork'
import updateProviderEns from 'src/logic/wallets/store/actions/updateProviderEns'
import closeSnackbar from '../notifications/store/actions/closeSnackbar'

const LAST_USED_PROVIDER_KEY = 'LAST_USED_PROVIDER'

export const loadLastUsedProvider = (): string | undefined => {
  return loadFromStorage<string>(LAST_USED_PROVIDER_KEY)
}

// 'mainnet' is hardcoded in onboard v1
const NETWORK_NAMES: Record<ChainId, string> = {
  [CHAIN_ID.ETHEREUM]: 'mainnet',
}

const getOnboard = (): API => {
  const config: Initialization = {
    networkId: parseInt(_getChainId(), 10),
    // Ledger requires lowercase names
    networkName: NETWORK_NAMES[_getChainId()] || getChainName().toLowerCase(),
    subscriptions: {
      wallet: async (wallet) => {
        if (wallet.provider) {
          setWeb3(wallet.provider)
        }

        const name = wallet.name || ''
        const hardwareWallet = wallet.type === 'hardware'
        const { address } = onboard().getState()
        const smartContractWallet =
          (!hardwareWallet && wallet.provider && address && (await isSmartContractWallet(getWeb3(), address))) || false

        store.dispatch(
          updateProviderWallet({
            name,
            hardwareWallet,
            smartContractWallet,
          }),
        )

        saveToStorage(LAST_USED_PROVIDER_KEY, name)
      },
      address: (address) => {
        store.dispatch(updateProviderAccount(address))
      },
      network: (networkdId) => {
        store.dispatch(updateProviderNetwork(networkdId?.toString() || ''))
        store.dispatch(closeSnackbar({ dismissAll: true }))

        instantiateSafeContracts()
      },
      ens: (ens) => {
        store.dispatch(updateProviderEns(ens?.name || ''))
      },
    },
    walletSelect: {
      description: 'Please select a wallet to connect to Gnosis Safe',
      wallets: getSupportedWallets(),
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      transactionDataCheck(),
    ],
  }

  return Onboard(config)
}

let currentOnboardInstance: API
export const onboard = (): API => {
  const chainId = _getChainId()
  if (!currentOnboardInstance || currentOnboardInstance.getState().appNetworkId.toString() !== chainId) {
    currentOnboardInstance = getOnboard()
  }

  return currentOnboardInstance
}

export default onboard
