import { fromJS, List, Map } from 'immutable'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { TOKEN_REDUCER_ID, TokenState } from 'src/logic/tokens/store/reducer/tokens'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import { buildTx, isCancelTransaction } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { SAFE_REDUCER_ID } from 'src/logic/safe/store/reducer/safe'
import { store } from 'src/store'
import fetchTransactions from 'src/logic/safe/store/actions/transactions/fetchTransactions/fetchTransactions'
import { Transaction, TransactionTypes } from 'src/logic/safe/store/models/types/transaction'
import { Token } from 'src/logic/tokens/store/model/token'
import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { DataDecoded } from 'src/logic/safe/store/models/types/transactions.d'

export type ConfirmationServiceModel = {
  confirmationType: string
  owner: string
  submissionDate: string
  signature: string
  signatureType: string
  transactionHash: string
}

export type TxServiceModel = {
  baseGas: number
  blockNumber?: number | null
  confirmations: ConfirmationServiceModel[]
  confirmationsRequired: number
  data: string | null
  dataDecoded?: DataDecoded
  ethGasPrice: string
  executionDate?: string | null
  executor: string
  fee: string
  gasPrice: string
  gasToken: string
  gasUsed: number
  isExecuted: boolean
  isSuccessful: boolean
  modified: string
  nonce: number
  operation: number
  origin: string | null
  refundReceiver: string
  safe: string
  safeTxGas: number
  safeTxHash: string
  signatures: string
  submissionDate: string | null
  to: string
  transactionHash?: string | null
  value: string
}

export type SafeTransactionsType = {
  cancel: any
  outgoing: any
}

export type OutgoingTxs = {
  cancellationTxs: Record<number, TxServiceModel>
  outgoingTxs: TxServiceModel[]
}

export type BatchProcessTxsProps = OutgoingTxs & {
  currentUser?: string
  knownTokens: Map<string, Token>
  safe: SafeRecord
}

/**
 * Differentiates outgoing transactions from its cancel ones and returns a split map
 * @param {string} safeAddress - safe's Ethereum Address
 * @param {TxServiceModel[]} outgoingTxs - collection of transactions (usually, returned by the /transactions service)
 * @returns {any|{cancellationTxs: {}, outgoingTxs: []}}
 */
const extractCancelAndOutgoingTxs = (safeAddress: string, outgoingTxs: TxServiceModel[]): OutgoingTxs => {
  return outgoingTxs.reduce(
    (acc: { cancellationTxs: Record<number, TxServiceModel>; outgoingTxs: TxServiceModel[] }, transaction) => {
      if (
        isCancelTransaction(transaction, safeAddress) &&
        outgoingTxs.find((tx) => tx.nonce === transaction.nonce && !isCancelTransaction(tx, safeAddress))
      ) {
        if (!isNaN(Number(transaction.nonce))) {
          acc.cancellationTxs[transaction.nonce] = transaction
        }
      } else {
        acc.outgoingTxs = [...acc.outgoingTxs, transaction]
      }
      return acc
    },
    {
      cancellationTxs: {},
      outgoingTxs: [],
    },
  )
}

type BatchRequestReturnValues = [TxServiceModel, string | undefined]

/**
 * Requests Contract's code for all the Contracts the Safe has interacted with
 * @param transactions
 * @returns {Promise<[Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>]>}
 */
const batchRequestContractCode = (transactions: TxServiceModel[]): Promise<BatchRequestReturnValues[]> => {
  if (!transactions || !Array.isArray(transactions)) {
    throw new Error('`transactions` must be provided in order to lookup information')
  }

  const batch = new web3ReadOnly.BatchRequest()

  const whenTxsValues = transactions.map((tx) => {
    return generateBatchRequests<BatchRequestReturnValues>({
      abi: [],
      address: tx.to,
      batch,
      context: tx,
      methods: [{ method: 'getCode', type: 'eth', args: [tx.to] }],
    })
  })

  batch.execute()

  return Promise.all(whenTxsValues)
}

/**
 * Receives a list of outgoing and its cancellation transactions and builds the tx object that will be store
 * @param cancellationTxs
 * @param currentUser
 * @param knownTokens
 * @param outgoingTxs
 * @param safe
 * @returns {Promise<{cancel: {}, outgoing: []}>}
 */
const batchProcessOutgoingTransactions = async ({
  cancellationTxs,
  currentUser,
  knownTokens,
  outgoingTxs,
  safe,
}: BatchProcessTxsProps): Promise<{
  cancel: Record<string, Transaction>
  outgoing: Transaction[]
}> => {
  // cancellation transactions
  const cancelTxsValues = Object.values(cancellationTxs)
  const cancellationTxsWithData = cancelTxsValues.length ? await batchRequestContractCode(cancelTxsValues) : []

  const cancel = {}
  for (const [tx, txCode] of cancellationTxsWithData) {
    cancel[`${tx.nonce}`] = await buildTx({
      cancellationTxs,
      currentUser,
      knownTokens,
      outgoingTxs,
      safe,
      tx,
      txCode,
    })
  }

  // outgoing transactions
  const outgoingTxsWithData = outgoingTxs.length ? await batchRequestContractCode(outgoingTxs) : []

  const outgoing: Transaction[] = []
  for (const [tx, txCode] of outgoingTxsWithData) {
    outgoing.push(
      await buildTx({
        cancellationTxs,
        currentUser,
        knownTokens,
        outgoingTxs,
        safe,
        tx,
        txCode,
      }),
    )
  }

  return { cancel, outgoing }
}

let previousETag: string | null = null
export const loadOutgoingTransactions = async (safeAddress: string): Promise<SafeTransactionsType> => {
  const defaultResponse = {
    cancel: Map(),
    outgoing: List(),
  }
  const state = store.getState()

  if (!safeAddress) {
    return defaultResponse
  }

  const knownTokens: TokenState = state[TOKEN_REDUCER_ID]
  const currentUser: string = state[PROVIDER_REDUCER_ID].get('account')
  const safe: SafeRecord = state[SAFE_REDUCER_ID].getIn(['safes', safeAddress])

  if (!safe) {
    return defaultResponse
  }

  const { eTag, results }: { eTag: string | null; results: TxServiceModel[] } = await fetchTransactions(
    TransactionTypes.OUTGOING,
    safeAddress,
    previousETag,
  )
  previousETag = eTag
  const { cancellationTxs, outgoingTxs } = extractCancelAndOutgoingTxs(safeAddress, results)

  // this should be only used for the initial load or when paginating
  const { cancel, outgoing } = await batchProcessOutgoingTransactions({
    cancellationTxs,
    currentUser,
    knownTokens,
    outgoingTxs,
    safe,
  })

  return {
    cancel: fromJS(cancel),
    outgoing: fromJS(outgoing),
  }
}
