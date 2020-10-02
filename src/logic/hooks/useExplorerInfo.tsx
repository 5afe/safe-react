import { useSelector } from 'react-redux'
import { providerSelector } from '../wallets/store/selectors'
import { getNetworkConfig } from 'src/config/utils'

export type BlockScanInfo = () => {
  alt?: string
  url?: string
}

export const useExplorerInfo = (hash?: string | null): BlockScanInfo => {
  const provider = useSelector(providerSelector)
  const config = getNetworkConfig(provider.network)

  const blockScanInfo = () => {
    const result = {
      url: '',
      alt: '',
    }
    if (!hash) {
      return result
    }
    const type = hash.length > 42 ? 'tx' : 'address'
    result.url = `${config?.environment.dev?.networkExplorerUrl}${type}/${hash}`
    result.alt = config?.environment.dev?.networkExplorerName || ''

    return result
  }

  return blockScanInfo
}
