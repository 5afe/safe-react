import axios from 'axios'

import { buildTxServiceUrl } from 'src/logic/safe/transactions'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'
import { TxServiceModel } from 'src/routes/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'

export interface FetchTransactionsInterface {
  getServiceUrl(): string
  getSafeAddress(): string
  setPreviousEtag(eTag: string): void
  fetch(): Promise<TxServiceModel[]>
}

class FetchTransactions implements FetchTransactionsInterface {
  _fetchConfig: {}
  _previousETag?: string | null
  _safeAddress?: string | null
  _txType = 'outgoing'
  _url: string

  constructor(safeAddress: string, txType: string) {
    this._safeAddress = safeAddress
    this._txType = txType
    this._url = this.getServiceUrl()
  }

  getSafeAddress(): string {
    return this._safeAddress
  }

  getServiceUrl(): string {
    return {
      incoming: buildIncomingTxServiceUrl,
      outgoing: buildTxServiceUrl,
    }[this._txType](this._safeAddress)
  }

  setPreviousEtag(eTag: string) {
    this._previousETag = eTag ? eTag : this._previousETag
    this._fetchConfig = eTag ? { headers: { 'If-None-Match': eTag } } : this._fetchConfig
  }

  async fetch(): Promise<TxServiceModel[]> {
    try {
      const response = await axios.get(this._url, this._fetchConfig)

      if (response.data.count > 0) {
        const { etag } = response.headers

        if (this._previousETag !== etag) {
          this.setPreviousEtag(etag)
          return response.data.results
        }
      }
    } catch (err) {
      if (!(err && err.response && err.response.status === 304)) {
        console.error(`Requests for outgoing transactions for ${this._safeAddress || 'unknown'} failed with 404`, err)
      } else {
        // NOTE: this is the expected implementation, currently the backend is not returning 304.
        // So I check if the returned etag is the same instead (see above)
      }
    }

    // defaults to an empty array to avoid type errors
    return []
  }
}

export default FetchTransactions
