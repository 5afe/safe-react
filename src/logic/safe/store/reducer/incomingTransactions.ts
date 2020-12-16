import { List, Map } from 'immutable'
import { Action, handleActions } from 'redux-actions'

import { ADD_INCOMING_TRANSACTIONS } from 'src/logic/safe/store/actions/addIncomingTransactions'
import { ExpandedTxDetails, Transaction, TransactionSummary } from 'src/logic/safe/store/models/types/gateway'
import { AppReduxState } from 'src/store'
import { sameString } from 'src/utils/strings'

export const INCOMING_TRANSACTIONS_REDUCER_ID = 'incomingTransactions'

export type AddTxPayload = { incomingTxs: List<TransactionSummary>; safeAddress: string }
export type UpdateTxPayload = { transactionId: string; transactionDetails: ExpandedTxDetails }

type Payloads = AddTxPayload | UpdateTxPayload

export default handleActions<AppReduxState['incomingTransactions'], Payloads>(
  {
    [ADD_INCOMING_TRANSACTIONS]: (state, { payload }: Action<AddTxPayload>) => {
      const { incomingTxs, safeAddress } = payload

      return state.withMutations((map) => {
        const stateTransactionsList = map.get(safeAddress)

        if (stateTransactionsList) {
          const txsToStore = stateTransactionsList.withMutations((txsList) => {
            incomingTxs.forEach((updateTx) => {
              const storedTxIndex = txsList.findIndex((tx) => sameString(tx.id, updateTx.id))

              if (storedTxIndex !== -1) {
                const nonResolvedStatuses: Transaction['txStatus'][] = ['AWAITING_CONFIRMATIONS', 'AWAITING_EXECUTION']

                // Update
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (nonResolvedStatuses.includes(txsList.get(storedTxIndex)?.txStatus)) {
                  // if the tx has a non-resolved status, then we update it with the newer data
                  txsList.update(storedTxIndex, (storedTx) => ({ ...storedTx, ...updateTx }))
                }
              } else {
                // Add new
                txsList.unshift(updateTx)
              }
            })
          })
          map.set(safeAddress, txsToStore)
        } else {
          map.set(safeAddress, incomingTxs)
        }
      })
    },
    UPDATE_TRANSACTION_DETAILS: (state, { payload }: Action<UpdateTxPayload>) => {
      const { transactionDetails, transactionId } = payload
      const match = transactionId.match(/^.+_(0x[0-9a-f]{40})_.+$/i)
      const safeAddress = match?.[1]

      if (!safeAddress) {
        return state
      }

      return state.withMutations((map) => {
        const stateTransactionsList = map.get(safeAddress)

        if (stateTransactionsList) {
          const txsToStore = stateTransactionsList.withMutations((txsList) => {
            const storedTxIndex = txsList.findIndex((tx) => sameString(tx.id, transactionId))

            if (storedTxIndex !== -1) {
              txsList.update(storedTxIndex, (storedTx) => ({ ...storedTx, txDetails: transactionDetails }))
            }
          })

          map.set(safeAddress, txsToStore)
        }
      })
    },
  },
  Map(),
)
