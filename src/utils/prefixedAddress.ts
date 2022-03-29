import { getShortName } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { ShortName } from 'src/config/chain.d'

export const isValidPrefix = (prefix: ShortName): boolean => {
  return getChains().some(({ shortName }) => shortName === prefix)
}

export const parsePrefixedAddress = (fullAddress = ''): { address: string; prefix: ShortName } => {
  const parts = fullAddress.split(':').filter(Boolean)
  const address = parts.length > 1 ? parts[1] : parts[0] || ''
  const prefix = parts.length > 1 ? parts[0] || '' : getShortName()
  return { prefix, address }
}
