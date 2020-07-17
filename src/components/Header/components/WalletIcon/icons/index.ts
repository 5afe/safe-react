// Icons
import metamaskIcon from './icon-metamask.png'
import walletConnectIcon from './icon-wallet-connect.svg'
import trezorIcon from './icon-trezor.svg'
import ledgerIcon from './icon-ledger.svg'
import dapperIcon from './icon-dapper.png'
import fortmaticIcon from './icon-fortmatic.svg'
import portisIcon from './icon-portis.svg'
import authereumIcon from './icon-authereum.png'
import torusIcon from './icon-torus.svg'
import uniloginIcon from './icon-unilogin.svg'
import coinbaseIcon from './icon-coinbase.svg'
import operaIcon from './icon-opera.png'

import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'

type WalletProviderNames = typeof WALLET_PROVIDER[keyof typeof WALLET_PROVIDER]

interface IconValue {
  src: string
  height: number
}

type WalletObjectsProps<Tvalue> = {
  [key in WalletProviderNames]: Tvalue
}

const WALLET_ICONS: WalletObjectsProps<IconValue> = {
  [WALLET_PROVIDER.METAMASK]: {
    src: metamaskIcon,
    height: 25,
  },
  [WALLET_PROVIDER.WALLETCONNECT]: {
    src: walletConnectIcon,
    height: 25,
  },
  [WALLET_PROVIDER.TREZOR]: {
    src: trezorIcon,
    height: 25,
  },
  [WALLET_PROVIDER.LEDGER]: {
    src: ledgerIcon,
    height: 25,
  },
  [WALLET_PROVIDER.DAPPER]: {
    src: dapperIcon,
    height: 25,
  },
  [WALLET_PROVIDER.FORTMATIC]: {
    src: fortmaticIcon,
    height: 25,
  },
  [WALLET_PROVIDER.PORTIS]: {
    src: portisIcon,
    height: 25,
  },
  [WALLET_PROVIDER.AUTHEREUM]: {
    src: authereumIcon,
    height: 25,
  },
  [WALLET_PROVIDER.TORUS]: {
    src: torusIcon,
    height: 30,
  },
  [WALLET_PROVIDER.UNILOGIN]: {
    src: uniloginIcon,
    height: 25,
  },
  [WALLET_PROVIDER.OPERA]: {
    src: operaIcon,
    height: 25,
  },
  [WALLET_PROVIDER.WALLETLINK]: {
    src: coinbaseIcon,
    height: 25,
  },
}

export default WALLET_ICONS
