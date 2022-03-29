import 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'
import { DataLayerArgs } from 'react-gtm-module'
import { BeamerConfig, BeamerMethods } from './Beamer.d'

type Theme = typeof theme

export {}
declare global {
  interface Window {
    isDesktop?: boolean
    ethereum?: {
      autoRefreshOnNetworkChange: boolean
      isMetaMask: boolean
    }
    beamer_config?: BeamerConfig
    Beamer?: BeamerMethods
    dataLayer?: DataLayerArgs['dataLayer']
  }
}
declare module '@openzeppelin/contracts/build/contracts/ERC721'
declare module 'currency-flags/dist/currency-flags.min.css'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {} // eslint-disable-line
}
