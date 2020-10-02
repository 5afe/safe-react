import { useSelector } from 'react-redux'
import { providerSelector } from '../wallets/store/selectors'
import { getNetworkConfig } from '../../config/utils'

export type BlockScanInfo = {
  alt: string
  url: string
}

// @todo (agustin) finish iimplementation
export const useExplorerInfo = (hash: string): BlockScanInfo | null => {
  const provider = useSelector(providerSelector)
  const config = getNetworkConfig(provider.network)

  const url = config?.environment.dev?.NETWORK_EXPLORER_URL
  console.log('URL', url)
  if (config && config.environment.dev) {
    return {
      url: config.environment.dev.NETWORK_EXPLORER_URL,
      alt: config.environment.dev.NETWORK_EXPLORER_NAME,
    }
  }
  return null
}
