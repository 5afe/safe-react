import { getTxServiceUrl, getSafeCreationTxUri } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'

export const buildSafeCreationTxUrl = (safeAddress: string): string => {
  const host = getTxServiceUrl()
  const address = checksumAddress(safeAddress)
  const base = getSafeCreationTxUri(address)

  return `${host}/${base}`
}
