import Web3Onboard from '@web3-onboard/core'
import { hexToNumberString, numberToHex } from 'web3-utils'
import type { provider as Provider } from 'web3-core'
import type { ConnectedChain, InitOptions, OnboardAPI, WalletState } from '@web3-onboard/core'
import type { EIP1193Provider } from '@web3-onboard/common/dist/types.d'
import type { Account, AppState } from '@web3-onboard/core/dist/types.d'

import { getChains } from 'src/config/cache/chains'
import { getRpcServiceUrl } from 'src/config'
import { resetWeb3, setWeb3 } from 'src/logic/wallets/getWeb3'
import { instantiateSafeContracts } from 'src/logic/contracts/safeContracts'
import { saveLastUsedWallet } from 'src/logic/wallets/onboard/utils'
import { getRecommendedInjectedWallets, getSupportedWalletModules } from 'src/logic/wallets/onboard/wallets'
import { PendingTxMonitor } from 'src/logic/safe/transactions/pendingTxMonitor'

// web3-onboard instance
export let _onboardInstance: OnboardAPI

const setOnboardInstance = (onboardInstance: OnboardAPI): void => {
  _onboardInstance = onboardInstance
}

export const getOnboardInstance = (): OnboardAPI => {
  if (!_onboardInstance) {
    throw new Error('web3-onboard is not initialized')
  }
  return _onboardInstance
}

// Initiation
let _unsubscribe: () => void
export const initOnboard = (): OnboardAPI => {
  _unsubscribe?.()

  const chains: InitOptions['chains'] = getChains().map(({ chainId, chainName, nativeCurrency, rpcUri }) => ({
    id: numberToHex(chainId),
    label: chainName,
    namespace: undefined,
    rpcUrl: getRpcServiceUrl(rpcUri),
    token: nativeCurrency.symbol,
  }))

  const onboardInstance = Web3Onboard({
    wallets: getSupportedWalletModules(),
    chains,
    appMetadata: {
      name: 'Gnosis Safe',
      icon: `<svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg">
              <path d="M137,9.84A128.75,128.75,0,1,0,265.7,138.59,128.76,128.76,0,0,0,137,9.84Zm94.23,135.78H171.44a36.38,36.38,0,1,1,.28-12.66h59.46a6.33,6.33,0,0,1,0,12.66Z" stroke="#fff" />
            </svg>`,
      description: 'Please select a wallet to connect to Gnosis Safe',
      recommendedInjectedWallets: getRecommendedInjectedWallets(),
    },
  })

  const { unsubscribe } = onboardInstance.state.select().subscribe((state) => {
    const { label, provider } = _getPrimaryWallet(state)

    if (label) {
      saveLastUsedWallet(label)
    }

    if (provider) {
      setWeb3(provider as unknown as Provider)
      instantiateSafeContracts()
      PendingTxMonitor.monitorAllTxs()
    } else {
      resetWeb3()
    }
  })

  _unsubscribe = unsubscribe
  setOnboardInstance(onboardInstance)

  return onboardInstance
}

const EMPTY_ACCOUNT: Account = {
  address: '',
  ens: null,
  balance: null,
}

const EMPTY_CONNECTED_CHAIN: ConnectedChain = {
  namespace: undefined,
  id: '',
}

const EMPTY_WALLET: WalletState = {
  label: '',
  icon: '',
  accounts: [EMPTY_ACCOUNT],
  chains: [EMPTY_CONNECTED_CHAIN],
  // web3-onboard doesn't populate provider until after the first wallet is selected
  provider: undefined as any as EIP1193Provider,
}

// Helpers
const _getOnboardState = (): AppState => {
  return getOnboardInstance().state.get()
}
const _getPrimaryWallet = (state: AppState): WalletState => {
  return state.wallets[0] || EMPTY_WALLET
}
const _getPrimaryAccount = (state: AppState): Account => {
  return _getPrimaryWallet(state).accounts[0]
}
const _getPrimaryConnectedChain = (state: AppState): ConnectedChain => {
  const chain = _getPrimaryWallet(state).chains[0]
  return { ...chain, id: hexToNumberString(chain.id) }
}

// Matches legacy `providers` store
export const getOnboardState = (
  onboardState = _getOnboardState(),
): {
  available: boolean
  loaded: boolean
  wallet: WalletState
  account: Account
  chain: ConnectedChain
  _state: AppState
} => {
  const primaryWallet = _getPrimaryWallet(onboardState)
  const primaryAccount = _getPrimaryAccount(onboardState)
  const primaryConnectedChain = _getPrimaryConnectedChain(onboardState)

  const available = !!primaryAccount.address

  return {
    available,
    loaded: available && !!primaryWallet.provider && !!primaryConnectedChain.id,
    wallet: primaryWallet,
    account: primaryAccount,
    chain: primaryConnectedChain,
    _state: onboardState,
  }
}
