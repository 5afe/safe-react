import axios from 'axios'

import { buildTxServiceUrl } from 'src/logic/safe/transactions'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { IncomingTxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadIncomingTransactions'
import { TransactionTypes } from 'src/logic/safe/store/models/types/transaction'

const getServiceUrl = (txType: string, safeAddress: string): string => {
  return {
    [TransactionTypes.INCOMING]: buildIncomingTxServiceUrl,
    [TransactionTypes.OUTGOING]: buildTxServiceUrl,
  }[txType](safeAddress)
}

async function fetchTransactions(
  txType: TransactionTypes.INCOMING,
  safeAddress: string,
  eTag: string | null,
): Promise<{ eTag: string | null; results: IncomingTxServiceModel[] }>
async function fetchTransactions(
  txType: TransactionTypes.OUTGOING,
  safeAddress: string,
  eTag: string | null,
): Promise<{ eTag: string | null; results: TxServiceModel[] }>
async function fetchTransactions(
  txType: TransactionTypes.INCOMING | TransactionTypes.OUTGOING,
  safeAddress: string,
  eTag: string | null,
): Promise<{ eTag: string | null; results: TxServiceModel[] | IncomingTxServiceModel[] }> {
  try {
    const url = getServiceUrl(txType, safeAddress)
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

  // defaults to an empty array to avoid type errors
  return { eTag, results: [] }
}

export default fetchTransactions
