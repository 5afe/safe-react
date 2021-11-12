import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

// We start from small to bigger. First having less values in storage
export type NetworkConfig = Pick<ChainInfo, 'chainId' | 'shortName' | 'chainName' | 'nativeCurrency' | 'theme'>

export const makeNetworkConfig = ({
  chainId,
  shortName,
  chainName,
  nativeCurrency,
  theme,
}: ChainInfo): NetworkConfig => ({
  chainId,
  shortName,
  chainName,
  nativeCurrency,
  theme,
})
