import axios, { AxiosResponse } from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { checksumAddress } from 'src/utils/checksumAddress'
import { Transaction } from 'src/logic/safe/store/models/types/transactions.d'

export type ServiceUriParams = {
  safeAddress: string
  limit: number
  offset: number
  orderBy?: string // todo: maybe this should be key of MultiSigTransaction | keyof EthereumTransaction
  queued?: boolean
  trusted?: boolean
}

type TransactionDTO = {
  count: number
  next?: string
  previous?: string
  results: Transaction[]
}

const getAllTransactionsUri = (safeAddress: string): string => {
  const address = checksumAddress(safeAddress)
  return `${getSafeServiceBaseUrl(address)}/all-transactions/`
}

const fetchAllTransactions = async (
  urlParams: ServiceUriParams,
  eTag?: string,
): Promise<{ responseEtag?: string; results: Transaction[]; count?: number }> => {
  const { safeAddress, limit, offset, orderBy, queued, trusted } = urlParams
  try {
    const url = getAllTransactionsUri(safeAddress)

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

    const response: AxiosResponse<TransactionDTO> = await axios.get(url, config)

    if (response.data.count > 0) {
      const { etag } = response.headers

      if (eTag !== etag) {
        return {
          responseEtag: etag,
          results: response.data.results,
          count: response.data.count,
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
  return { responseEtag: eTag, results: [] }
}

const etagsByPage = {}
export const loadAllTransactions = async (
  uriParams: ServiceUriParams,
): Promise<{
  transactions: Transaction[]
  totalTransactionsAmount?: number
}> => {
  const previousEtag = etagsByPage && etagsByPage[uriParams.offset]
  const { responseEtag, results, count } = await fetchAllTransactions(uriParams, previousEtag)
  etagsByPage[uriParams.offset] = responseEtag

  return {
    transactions: results,
    totalTransactionsAmount: count,
  }
}
