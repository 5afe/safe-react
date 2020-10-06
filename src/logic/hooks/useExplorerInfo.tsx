import { getNetworkExplorerInfo } from 'src/config'

export type BlockScanInfo = () => {
  alt: string
  url: string
}

export const useExplorerInfo = (hash?: string | null): BlockScanInfo => {
  const { name, url } = getNetworkExplorerInfo()

  const blockScanInfo = () => {
    const result = {
      url: '',
      alt: '',
    }
    if (!hash) {
      return result
    }
    const type = hash.length > 42 ? 'tx' : 'address'
    result.url = `${url}${type}/${hash}`
    result.alt = name || ''

    return result
  }

  return blockScanInfo
}
