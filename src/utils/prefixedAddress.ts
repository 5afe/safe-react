import { getCurrentShortChainName } from 'src/config'
import { SHORT_NAME } from 'src/config/networks/network.d'

export const isValidPrefix = (prefix: string): boolean => {
  return Object.values(SHORT_NAME).includes(prefix as SHORT_NAME)
}

export const parsePrefixedAddress = (fullAddress = ''): { address: string; prefix: string } => {
  const parts = fullAddress.split(':').filter(Boolean)
  const address = parts.length > 1 ? parts[1] : parts[0] || ''
  const prefix = parts.length > 1 ? parts[0] || '' : getCurrentShortChainName()
  return { prefix, address }
}
