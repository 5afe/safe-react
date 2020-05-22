import axios from 'axios'
import bn from 'bignumber.js'
import { List, Map } from 'immutable'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { buildIncomingTxServiceUrl } from 'src/logic/safe/transactions/incomingTxHistory'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { makeIncomingTransaction } from 'src/routes/safe/store/models/incomingTransaction'

type IncomingTxServiceModel = {
  blockNumber: number
  transactionHash: string
  to: string
  value: number
  tokenAddress: string
  from: string
}

const buildIncomingTransactionFrom = ([tx, symbol, decimals, fee]: [
  IncomingTxServiceModel,
  string,
  number,
  string,
]) => {
  // this is a particular treatment for the DCD token, as it seems to lack of symbol and decimal methods
  if (tx.tokenAddress && tx.tokenAddress.toLowerCase() === '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a') {
    symbol = 'DCD'
    decimals = 9
  }

  const { transactionHash, ...incomingTx } = tx

  return makeIncomingTransaction({
    ...incomingTx,
    symbol,
    decimals,
    fee,
    executionTxHash: transactionHash,
    safeTxHash: transactionHash,
  })
}

const batchIncomingTxsTokenDataRequest = (txs: IncomingTxServiceModel[]) => {
  const batch = new web3ReadOnly.BatchRequest()

  const whenTxsValues = txs.map((tx) => {
    const methods = ['symbol', 'decimals', { method: 'getTransaction', args: [tx.transactionHash], type: 'eth' }]

    return generateBatchRequests({
      abi: ALTERNATIVE_TOKEN_ABI,
      address: tx.tokenAddress,
      batch,
      context: tx,
      methods,
    })
  })

  batch.execute()

  return Promise.all(whenTxsValues).then((txsValues) =>
    txsValues.map(([tx, symbol, decimals, { gas, gasPrice }]) => [
      tx,
      symbol === null ? 'ETH' : symbol,
      decimals === null ? '18' : decimals,
      new bn(gas).div(gasPrice).toFixed(),
    ]),
  )
}

let prevIncomingTxsEtag = null
export const loadIncomingTransactions = async (safeAddress: string) => {
  let incomingTransactions: IncomingTxServiceModel[] = []
  try {
    const config = prevIncomingTxsEtag
      ? {
          headers: {
            'If-None-Match': prevIncomingTxsEtag,
          },
        }
      : undefined
    const url = buildIncomingTxServiceUrl(safeAddress)
    const response = await axios.get(url, config)
    if (response.data.count > 0) {
      incomingTransactions = response.data.results
      if (prevIncomingTxsEtag === response.headers.etag) {
        // The txs are the same as we currently have, we don't have to proceed
        return
      }
      prevIncomingTxsEtag = response.headers.etag
    }
  } catch (err) {
    if (err && err.response && err.response.status === 304) {
      // We return cached transactions
      return
    } else {
      console.error(`Requests for incoming transactions for ${safeAddress} failed with 404`, err)
    }
  }

  const incomingTxsWithData = await batchIncomingTxsTokenDataRequest(incomingTransactions)
  const incomingTxsRecord = incomingTxsWithData.map(buildIncomingTransactionFrom)
  return Map({ [safeAddress]: List(incomingTxsRecord) })
}
