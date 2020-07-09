// Icons
import metamaskIcon from './icon-metamask.png'
import metamaskIcon2x from './icon-metamask@2x.png'
import walletConnectIcon from './icon-wallet-connect.svg'
import trezorIcon from './icon-trezor.svg'
import ledgerIcon from './icon-ledger.svg'
import dapperIcon from './icon-dapper.png'
import dapperIcon2x from './icon-dapper@2x.png'
import fortmaticIcon from './icon-fortmatic.svg'
import portisIcon from './icon-portis.svg'
import authereumIcon from './icon-authereum.png'
import torusIcon from './icon-torus.svg'
import uniloginIcon from './icon-unilogin.svg'
import coinbaseIcon from './icon-coinbase.svg'
import operaIcon from './icon-opera.png'
import operaIcon2x from './icon-opera@2x.png'

import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'

interface WalletObjectsProps<TValue> {
  [key: string]: TValue
}

interface IconValue {
  src: string
  srcSet: string
  height: number
}

const WALLET_ICONS: WalletObjectsProps<IconValue> = {
  [WALLET_PROVIDER.METAMASK]: {
    src: metamaskIcon,
    srcSet: metamaskIcon2x,
    height: 25,
  },
  [WALLET_PROVIDER.WALLETCONNECT]: {
    src: walletConnectIcon,
    srcSet: walletConnectIcon,
    height: 25,
  },
  [WALLET_PROVIDER.TREZOR]: {
    src: trezorIcon,
    srcSet: trezorIcon,
    height: 25,
  },
  [WALLET_PROVIDER.LEDGER]: {
    src: ledgerIcon,
    srcSet: ledgerIcon,
    height: 25,
  },
  [WALLET_PROVIDER.DAPPER]: {
    src: dapperIcon,
    srcSet: dapperIcon2x,
    height: 25,
  },
  [WALLET_PROVIDER.FORTMATIC]: {
    src: fortmaticIcon,
    srcSet: fortmaticIcon,
    height: 25,
  },
  [WALLET_PROVIDER.PORTIS]: {
    src: portisIcon,
    srcSet: portisIcon,
    height: 25,
  },
  [WALLET_PROVIDER.AUTHEREUM]: {
    src: authereumIcon,
    srcSet: authereumIcon,
    height: 25,
  },
  [WALLET_PROVIDER.TORUS]: {
    src: torusIcon,
    srcSet: torusIcon,
    height: 30,
  },
  [WALLET_PROVIDER.UNILOGIN]: {
    src: uniloginIcon,
    srcSet: uniloginIcon,
    height: 25,
  },
  [WALLET_PROVIDER.OPERA]: {
    src: operaIcon,
    srcSet: operaIcon2x,
    height: 25,
  },
  [WALLET_PROVIDER.WALLETLINK]: {
    src: coinbaseIcon,
    srcSet: coinbaseIcon,
    height: 25,
  },
}

export default WALLET_ICONS
