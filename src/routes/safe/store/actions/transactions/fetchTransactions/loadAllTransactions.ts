import { List, Map } from 'immutable'
import axios from 'axios'

import { getAllTxServiceUriTo, getTxServiceHost } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Transaction } from '../../../models/types/transactions'

const getAllTransactionsUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getAllTxServiceUriTo(address)

  return `${host}${base}`
}

const fetchAllTransactions = async (
  safeAddress: string,
  eTag: string | null,
): Promise<{ eTag: string; results: Transaction[] }> => {
  try {
    const url = getAllTransactionsUrl(safeAddress)
    const response = await axios.get(url, eTag ? { headers: { 'If-None-Match': eTag } } : undefined)

    if (response.data.count > 0) {
      const { etag } = response.headers

      if (eTag !== etag) {
        return {
          eTag: etag,
          results: response.data.results,
        }
      }
    }
  } catch (err) {
    if (!(err && err.response && err.response.status === 304)) {
      console.error(`Requests for outgoing transactions for ${safeAddress || 'unknown'} failed with 404`, err)
    } else {
      // NOTE: this is the expected implementation, currently the backend is not returning 304.
      // So I check if the returned etag is the same instead (see above)
    }
  }
  return { eTag, results: [] }
}

let previousETag = null
export const loadAllTransactions = async (safeAddress: string): Promise<any> => {
  const { eTag, results } = await fetchAllTransactions(safeAddress, previousETag)
  previousETag = eTag

  return Map({ [safeAddress]: List(results) })
}
