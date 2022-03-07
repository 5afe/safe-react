import metamaskIcon from './icon-metamask.png'
import trustIcon from './icon-trust.svg'
import latticeIcon from './icon-lattice.svg'
import authereumIcon from './icon-authereum.png'
import coinbaseIcon from './icon-coinbase.svg'
import operaIcon from './icon-opera.png'
import operaTouchIcon from './icon-opera-touch.png'
import squarelinkIcon from './icon-squarelink.png'
import { extractWalletModule, WALLET_MODULES } from 'src/logic/wallets/onboard/wallets'

const WALLET_ICON_HEIGHT = 25

const onboardWalletModuleIcons = (): typeof WALLET_ICONS => {
  return Object.entries(WALLET_MODULES).reduce(async (acc, [key, module]) => {
    return {
      ...acc,
      [key]: {
        src: (await extractWalletModule(module)?.getIcon()) || '',
        height: WALLET_ICON_HEIGHT,
      },
    }
  }, {})
}
export const WALLET_ICONS: { [key: string]: { src: string; height: number } } = {
  ...onboardWalletModuleIcons(),
  // Injected
  Authereum: {
    src: authereumIcon,
    height: WALLET_ICON_HEIGHT,
  },
  Coinbase: {
    src: coinbaseIcon,
    height: WALLET_ICON_HEIGHT,
  },
  Lattice1: {
    src: latticeIcon,
    height: WALLET_ICON_HEIGHT,
  },
  MetaMask: {
    src: metamaskIcon,
    height: WALLET_ICON_HEIGHT,
  },
  Opera: {
    src: operaIcon,
    height: WALLET_ICON_HEIGHT,
  },
  'Opera Touch': {
    src: operaTouchIcon,
    height: WALLET_ICON_HEIGHT,
  },
  Squarelink: {
    src: squarelinkIcon,
    height: WALLET_ICON_HEIGHT,
  },
  Trust: {
    src: trustIcon,
    height: WALLET_ICON_HEIGHT,
  },
}

export default WALLET_ICONS
