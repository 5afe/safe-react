import Onboard from 'bnc-onboard'
import { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { store } from 'src/store'
import { _getChainId, getChainName } from 'src/config'
import { setWeb3 } from './getWeb3'
import { fetchProvider, removeProvider } from './store/actions'
import transactionDataCheck from './transactionDataCheck'
import { getSupportedWallets } from './utils/walletList'
import { ChainId, CHAIN_ID } from 'src/config/chain.d'

const NETWORK_NAMES: Record<ChainId, string> = {
  [CHAIN_ID.ETHEREUM]: 'mainnet',
}

const getOnboardConfiguration = () => {
  let lastUsedAddress = ''
  let providerName: string | null = null
  let lastNetworkId = ''

  return {
    networkId: parseInt(_getChainId(), 10),
    // Is it mandatory for Ledger to work to send network name in lowercase
    // @FIXME: Move to CGW
    networkName: NETWORK_NAMES[_getChainId()] || getChainName().toLowerCase(),
    subscriptions: {
      wallet: (wallet: Wallet) => {
        if (wallet.provider) {
          // this function will intialize web3 and store it somewhere available throughout the dapp and
          // can also instantiate your contracts with the web3 instance
          setWeb3(wallet.provider)
          providerName = wallet.name
        }
      },
      address: (address: string) => {
        const networkId = _getChainId()

        if (!lastUsedAddress && address && providerName) {
          lastUsedAddress = address
          lastNetworkId = networkId
          store.dispatch(fetchProvider(providerName))
        }

        // we don't have an unsubscribe event so we rely on this
        if (!address && lastUsedAddress) {
          lastUsedAddress = ''
          providerName = null
          store.dispatch(removeProvider({ keepStorageKey: lastNetworkId !== networkId }))
        }
      },
    },
    walletSelect: {
      description: 'Please select a wallet to connect to Boba Multisig',
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
}

let currentOnboardInstance: API
export const onboard = (): API => {
  const chainId = _getChainId()
  if (!currentOnboardInstance || currentOnboardInstance.getState().appNetworkId.toString() !== chainId) {
    currentOnboardInstance = Onboard(getOnboardConfiguration())
  }

  return currentOnboardInstance
}

export default onboard
