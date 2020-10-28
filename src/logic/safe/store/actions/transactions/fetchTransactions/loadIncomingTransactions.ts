import bn from 'bignumber.js'
import { List, Map } from 'immutable'
import { Transaction, TransactionReceipt } from 'web3-core'
import { AbiItem } from 'web3-utils'

import { getNetworkInfo } from 'src/config'
import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { ALTERNATIVE_TOKEN_ABI } from 'src/logic/tokens/utils/alternativeAbi'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { makeIncomingTransaction } from 'src/logic/safe/store/models/incomingTransaction'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions/fetchTransactions'
import { TransactionTypes } from 'src/logic/safe/store/models/types/transaction'

export type IncomingTxServiceModel = {
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
  const { nativeCoin } = getNetworkInfo()

  const whenTxsValues = txs.map((tx) => {
    const methods = [
      'symbol',
      'decimals',
      { method: 'getTransaction', args: [tx.transactionHash], type: 'eth' },
      { method: 'getTransactionReceipt', args: [tx.transactionHash], type: 'eth' },
    ]

    return generateBatchRequests<
      [
        IncomingTxServiceModel,
        string | undefined,
        string | undefined,
        Transaction | undefined,
        TransactionReceipt | undefined,
      ]
    >({
      abi: ALTERNATIVE_TOKEN_ABI as AbiItem[],
      address: tx.tokenAddress,
      batch,
      context: tx,
      methods,
    })
  })

  batch.execute()

  return Promise.all(whenTxsValues).then((txsValues) =>
    txsValues.map(([tx, symbol, decimals, ethTx, ethTxReceipt]) => [
      tx,
      symbol ? symbol : nativeCoin.symbol,
      decimals ? decimals : nativeCoin.decimals,
      new bn(ethTx?.gasPrice ?? 0).times(ethTxReceipt?.gasUsed ?? 0),
    ]),
  )
}

let previousETag: string | null = null
export const loadIncomingTransactions = async (safeAddress: string): Promise<Map<string, List<any>>> => {
  const { eTag, results } = await fetchTransactions(TransactionTypes.INCOMING, safeAddress, previousETag)
  previousETag = eTag

  const incomingTxsWithData = await batchIncomingTxsTokenDataRequest(results)
  const incomingTxsRecord = incomingTxsWithData.map(buildIncomingTransactionFrom)
  return Map({ [safeAddress]: List(incomingTxsRecord) })
}
