import { List, Map } from 'immutable'
import axios, { AxiosResponse } from 'axios'

import { getAllTxServiceUriTo, getTxServiceHost } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Transaction } from '../../../models/types/transactions'

type ServiceUriParams = {
  safeAddress: string
  limit?: number
  offset?: number
  orderBy?: string // todo: maybe this should be key of MultiSigTransaction | keyof EthereumTransaction
  queued?: boolean
  trusted?: boolean
}

type EndpointResponse = {
  count: number
  next?: string
  previous?: string
  results: Transaction[]
}

const getAllTransactionsUrl = (safeAddress: string) => {
  const host = getTxServiceHost()
  const address = checksumAddress(safeAddress)
  const base = getAllTxServiceUriTo(address)

  return `${host}${base}`
}

const fetchAllTransactions = async (
  urlParams: ServiceUriParams,
  eTag: string | null,
): Promise<{ eTag: string; results: Transaction[] }> => {
  const { safeAddress, limit, offset, orderBy, queued, trusted } = urlParams
  try {
    const url = getAllTransactionsUrl(safeAddress)

    const config = {
      params: {
        limit,
        offset,
        orderBy,
        queued,
        trusted,
      },
      headers: eTag ? { 'If-None-Match': eTag } : undefined,
    }

    const response: AxiosResponse<EndpointResponse> = await axios.get(url, config)

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

export const loadAllTransactions = async (safeAddress: string): Promise<Map<string, List<Transaction>>> => {
  const { eTag, results } = await fetchAllTransactions({ safeAddress }, previousETag)
  previousETag = eTag

  return Map({ [safeAddress]: List(results) })
}
