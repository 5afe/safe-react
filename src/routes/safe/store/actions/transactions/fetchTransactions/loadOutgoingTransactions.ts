import { fromJS, List, Map } from 'immutable'

import generateBatchRequests from 'src/logic/contracts/generateBatchRequests'
import { TOKEN_REDUCER_ID } from 'src/logic/tokens/store/reducer/tokens'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import { buildTx, isCancelTransaction } from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'
import { SAFE_REDUCER_ID } from 'src/routes/safe/store/reducer/safe'
import { store } from 'src/store'
import { DecodedMethods } from 'src/logic/contracts/methodIds'
import fetchTransactions from 'src/routes/safe/store/actions/transactions/fetchTransactions/fetchTransactions'
import { TransactionTypes } from 'src/routes/safe/store/models/types/transaction'

export type ConfirmationServiceModel = {
  owner: string
  submissionDate: Date
  signature: string
  transactionHash: string
}

export type TxServiceModel = {
  baseGas: number
  blockNumber?: number | null
  confirmations: ConfirmationServiceModel[]
  creationTx?: boolean | null
  data?: string | null
  dataDecoded?: DecodedMethods
  executionDate?: string | null
  executor: string
  gasPrice: number
  gasToken: string
  isExecuted: boolean
  isSuccessful: boolean
  nonce?: number | null
  operation: number
  origin?: string | null
  refundReceiver: string
  safeTxGas: number
  safeTxHash: string
  submissionDate?: string | null
  to: string
  transactionHash?: string | null
  value: number
}

export type SafeTransactionsType = {
  cancel: any
  outgoing: any
}

export type OutgoingTxs = {
  cancellationTxs: any
  outgoingTxs: any
}

export type BatchProcessTxsProps = OutgoingTxs & {
  currentUser?: string
  knownTokens: any
  safe: any
}

/**
 * Differentiates outgoing transactions from its cancel ones and returns a split map
 * @param {string} safeAddress - safe's Ethereum Address
 * @param {TxServiceModel[]} outgoingTxs - collection of transactions (usually, returned by the /transactions service)
 * @returns {any|{cancellationTxs: {}, outgoingTxs: []}}
 */
const extractCancelAndOutgoingTxs = (safeAddress: string, outgoingTxs: TxServiceModel[]): OutgoingTxs => {
  return outgoingTxs.reduce(
    (acc, transaction) => {
      if (isCancelTransaction(transaction, safeAddress)) {
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

/**
 * Requests Contract's code for all the Contracts the Safe has interacted with
 * @param transactions
 * @returns {Promise<[Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>, Promise<*[]>]>}
 */
const batchRequestContractCode = (transactions: any[]): Promise<any[]> => {
  if (!transactions || !Array.isArray(transactions)) {
    throw new Error('`transactions` must be provided in order to lookup information')
  }

  const batch = new web3ReadOnly.BatchRequest()

  const whenTxsValues = transactions.map((tx) => {
    return generateBatchRequests({
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
  cancel: any
  outgoing: any
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

  const outgoing = []
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

let previousETag = null
export const loadOutgoingTransactions = async (safeAddress: string): Promise<SafeTransactionsType> => {
  const defaultResponse = {
    cancel: Map(),
    outgoing: List(),
  }
  const state = store.getState()

  if (!safeAddress) {
    return defaultResponse
  }

  const knownTokens = state[TOKEN_REDUCER_ID]
  const currentUser = state[PROVIDER_REDUCER_ID].get('account')
  const safe = state[SAFE_REDUCER_ID].getIn([SAFE_REDUCER_ID, safeAddress])

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
