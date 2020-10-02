import { useSelector } from 'react-redux'
import { providerSelector } from '../wallets/store/selectors'
import { getNetworkConfig } from '../../config/utils'

export type BlockScanInfo = () => {
  alt?: string
  url?: string
}

// @todo (agustin) finish iimplementation
export const useExplorerInfo = (hash?: string | null): BlockScanInfo => {
  const provider = useSelector(providerSelector)
  const config = getNetworkConfig(provider.network)

  const url = config?.environment.dev?.networkExplorerUri
  console.log('URL', url, 'etwork', provider.network)

  const blockScanInfo = () => {
    return {
      url: hash ? config?.environment.dev?.networkExplorerUri : '',
      alt: config?.environment.dev?.networkExplorerName,
    }
  }

  return blockScanInfo
}
