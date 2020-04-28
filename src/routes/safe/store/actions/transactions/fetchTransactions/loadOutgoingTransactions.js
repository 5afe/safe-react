// @flow
let prevSaveTransactionsEtag = null
export const loadOutgoingTransactions = async (
  safeAddress: string,
  getState: GetState,
): Promise<SafeTransactionsType> => {
  let transactions: TxServiceModel[] = addMockSafeCreationTx(safeAddress)

  try {
    const config = prevSaveTransactionsEtag
      ? {
          headers: {
            'If-None-Match': prevSaveTransactionsEtag,
          },
        }
      : undefined

    const url = buildTxServiceUrl(safeAddress)
    const response = await axios.get(url, config)
    if (response.data.count > 0) {
      if (prevSaveTransactionsEtag === response.headers.etag) {
        // The txs are the same as we currently have, we don't have to proceed
        return
      }
      transactions = transactions.concat(response.data.results)
      prevSaveTransactionsEtag = response.headers.etag
    }
  } catch (err) {
    if (err && err.response && err.response.status === 304) {
      // NOTE: this is the expected implementation, currently the backend is not returning 304.
      // So I check if the returned etag is the same instead (see above)
      return
    } else {
      console.error(`Requests for outgoing transactions for ${safeAddress} failed with 404`, err)
    }
  }

  const state = getState()
  const knownTokens = state[TOKEN_REDUCER_ID]
  const txsWithData = await batchTxTokenRequest(transactions)
  // In case that the etags don't match, we parse the new transactions and save them to the cache
  const txsRecord: Array<RecordInstance<TransactionProps>> = await Promise.all(
    txsWithData.map(([tx: TxServiceModel, decimals, code, symbol, name]) =>
      buildTransactionFrom(safeAddress, tx, knownTokens, decimals, symbol, name, code),
    ),
  )

  const groupedTxs = List(txsRecord).groupBy((tx) => (tx.get('cancellationTx') ? 'cancel' : 'outgoing'))

  return {
    outgoing: Map().set(safeAddress, groupedTxs.get('outgoing')),
    cancel: Map().set(safeAddress, groupedTxs.get('cancel')),
  }
}
