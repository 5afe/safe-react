import type {
  AppMetadata,
  RecommendedInjectedWallets,
  WalletInit,
  WalletModule,
} from '@web3-onboard/common/dist/types.d'
import type { DeviceBrowserName, DeviceOSName, DeviceType } from '@web3-onboard/common/dist/types.d'

import fortmaticModule from '@web3-onboard/fortmatic'
import injectedModule from '@web3-onboard/injected-wallets'
import keepkeyModule from '@web3-onboard/keepkey'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import mewModule from '@web3-onboard/mew'
import portisModule from '@web3-onboard/portis'
import torusModule from '@web3-onboard/torus'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import walletLinkModule from '@web3-onboard/walletlink'

// import pairingModule from 'src/logic/wallets/pairing/module'
import { FORTMATIC_KEY, PORTIS_ID } from 'src/utils/constants'
import { getDisabledWallets } from 'src/config'

enum WALLET_KEYS {
  // PAIRING = 'PAIRING',
  FORTMATIC = 'FORTMATIC',
  INJECTED = 'INJECTED',
  KEEPKEY = 'KEEPKEY',
  KEYSTONE = 'KEYSTONE',
  LEDGER = 'LEDGER',
  MEW = 'MEW',
  PORTIS = 'PORTIS',
  TORUS = 'TORUS',
  TREZOR = 'TREZOR',
  WALLETCONNECT = 'WALLETCONNECT',
  WALLETLINK = 'WALLETLINK',
}

export const WC_BRIDGE = 'https://safe-walletconnect.gnosis.io/'

export const WALLET_MODULES: Record<WALLET_KEYS, WalletInit> = {
  // PAIRING: pairingModule(),
  FORTMATIC: fortmaticModule({ apiKey: FORTMATIC_KEY }),
  INJECTED: injectedModule(),
  KEEPKEY: keepkeyModule(),
  KEYSTONE: keystoneModule(),
  LEDGER: ledgerModule(),
  MEW: mewModule(),
  PORTIS: portisModule({ apiKey: PORTIS_ID }),
  TORUS: torusModule(),
  TREZOR: trezorModule({ appUrl: 'gnosis-safe.io', email: 'safe@gnosis.io' }),
  WALLETCONNECT: walletConnectModule({ bridge: WC_BRIDGE }),
  WALLETLINK: walletLinkModule(),
}

export const extractWalletModule = (module: WalletInit): WalletModule | null => {
  const walletModule = module({
    device: {
      browser: { name: '' as DeviceBrowserName, version: '' },
      os: { name: '' as DeviceOSName, version: '' },
      type: '' as DeviceType,
    },
  })

  if (!walletModule) {
    return walletModule
  }

  return Array.isArray(walletModule) ? walletModule[0] : walletModule
}

export const WALLET_MODULE_LABELS: Record<WALLET_KEYS, string> = Object.entries(WALLET_MODULES).reduce(
  (acc, [key, module]) => ({ ...acc, [key]: extractWalletModule(module)?.label || '' }),
  {} as Record<WALLET_KEYS, string>,
)

export enum WALLET_TYPE {
  HARDWARE = 'HARDWARE',
}

export enum CGW_WALLETS {
  // SAFE_MOBILE = 'safeMobile',
  FORTMATIC = 'fortmatic',
  ONBOARD_DETECTED_WALLET = 'detectedwallet',
  KEYSTONE = 'keystone',
  LEDGER = 'ledger',
  PORTIS = 'portis',
  TORUS = 'torus',
  TREZOR = 'trezor',
  WALLETCONNECT = 'walletConnect',
  WALLETLINK = 'walletLink',
}

type WALLET = {
  module: WalletInit
  label: WalletModule['label']
  cgw?: CGW_WALLETS
  type?: WALLET_TYPE
  supportsDesktopApp: boolean
}

export const WALLETS: WALLET[] = [
  // {
  //   module: WALLET_MODULES.PAIRING,
  //   label: WALLET_MODULE_LABELS.PAIRING,
  //   cgw: CGW_WALLETS.SAFE_MOBILE,
  //   supportsDesktopApp: true,
  // },
  {
    module: WALLET_MODULES.FORTMATIC,
    label: WALLET_MODULE_LABELS.FORTMATIC,
    cgw: CGW_WALLETS.FORTMATIC,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.INJECTED,
    label: WALLET_MODULE_LABELS.INJECTED,
    cgw: CGW_WALLETS.ONBOARD_DETECTED_WALLET,
    supportsDesktopApp: false,
  },
  {
    module: WALLET_MODULES.KEEPKEY,
    label: WALLET_MODULE_LABELS.KEEPKEY,
    type: WALLET_TYPE.HARDWARE,
    supportsDesktopApp: false,
  },
  {
    module: WALLET_MODULES.KEYSTONE,
    label: WALLET_MODULE_LABELS.KEYSTONE,
    cgw: CGW_WALLETS.KEYSTONE,
    type: WALLET_TYPE.HARDWARE,
    supportsDesktopApp: false,
  },
  {
    module: WALLET_MODULES.LEDGER,
    label: WALLET_MODULE_LABELS.LEDGER,
    cgw: CGW_WALLETS.LEDGER,
    type: WALLET_TYPE.HARDWARE,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.MEW,
    label: WALLET_MODULE_LABELS.MEW,
    supportsDesktopApp: false,
  },
  {
    module: WALLET_MODULES.PORTIS,
    label: WALLET_MODULE_LABELS.PORTIS,
    cgw: CGW_WALLETS.PORTIS,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.TORUS,
    label: WALLET_MODULE_LABELS.TORUS,
    cgw: CGW_WALLETS.TORUS,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.TREZOR,
    label: WALLET_MODULE_LABELS.TREZOR,
    type: WALLET_TYPE.HARDWARE,
    cgw: CGW_WALLETS.TREZOR,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.WALLETCONNECT,
    label: WALLET_MODULE_LABELS.WALLETCONNECT,
    cgw: CGW_WALLETS.WALLETCONNECT,
    supportsDesktopApp: true,
  },
  {
    module: WALLET_MODULES.WALLETLINK,
    label: WALLET_MODULE_LABELS.WALLETLINK,
    cgw: CGW_WALLETS.WALLETLINK,
    supportsDesktopApp: false,
  },
]

const RECOMMENDED_INJECTED_WALLETS: RecommendedInjectedWallets[] = [{ name: 'MetaMask', url: 'https://metamask.io' }]

const isWalletDisabled = (label: string): boolean => {
  return getDisabledWallets().includes(label)
}
const isPlatformSupportedWallet = (supportsDesktopApp: boolean): boolean => {
  return window.isDesktop ? supportsDesktopApp : true
}
const isWallet = (wallet: WALLET, label: WalletModule['label']): boolean => {
  return [wallet.label, wallet.cgw].includes(label)
}

export const getSupportedWallets = (): WALLET[] => {
  return WALLETS.filter(({ label, cgw = '', supportsDesktopApp }) => {
    if (isWalletDisabled(label) || isWalletDisabled(cgw)) {
      return false
    }
    return isPlatformSupportedWallet(supportsDesktopApp)
  })
}

export const isSupportedWallet = (label: WalletModule['label']): boolean => {
  return getSupportedWallets().some((wallet) => isWallet(wallet, label))
}

// Onboard config
export const getSupportedWalletModules = (): WalletInit[] => {
  return getSupportedWallets().map(({ module }) => module)
}

export const getRecommendedInjectedWallets = (): AppMetadata['recommendedInjectedWallets'] => {
  const { supportsDesktopApp = false } = WALLETS.find((wallet) => isWallet(wallet, WALLET_MODULE_LABELS.INJECTED)) || {}

  return isPlatformSupportedWallet(supportsDesktopApp) ? RECOMMENDED_INJECTED_WALLETS : []
}
