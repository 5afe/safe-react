import { List, Map } from 'immutable'
import { batch } from 'react-redux'
import { TransactionReceipt } from 'web3-core'

import { addOrUpdateCancellationTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateCancellationTransactions'
import { addOrUpdateTransactions } from 'src/logic/safe/store/actions/transactions/addOrUpdateTransactions'
import { removeCancellationTransaction } from 'src/logic/safe/store/actions/transactions/removeCancellationTransaction'
import { removeTransaction } from 'src/logic/safe/store/actions/transactions/removeTransaction'
import { Dispatch } from 'src/logic/safe/store/actions/types.d'
import { makeConfirmation } from 'src/logic/safe/store/models/confirmation'
import { Transaction, TransactionStatus } from 'src/logic/safe/store/models/types/transaction'
import { safeTransactionsSelector } from 'src/logic/safe/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import { AppReduxState } from 'src/store'

type SetPendingTransactionParams = {
  transaction: Transaction
  from: string
}

const setTxStatusAsPending = ({ transaction, from }: SetPendingTransactionParams): Transaction =>
  transaction.withMutations((transaction) => {
    transaction
      // setting user as the one who has triggered the tx
      // this allows to display the owner's "pending" status
      .updateIn(['ownersWithPendingActions', transaction.isCancellationTx ? 'reject' : 'confirm'], (previous) =>
        previous.push(from),
      )
      // global transaction status
      .set('status', TransactionStatus.PENDING)
  })

type SetOptimisticTransactionParams = {
  transaction: Transaction
  from: string
  isExecution: boolean
  receipt: TransactionReceipt
}

const updateTxBasedOnReceipt = ({
  transaction,
  from,
  isExecution,
  receipt,
}: SetOptimisticTransactionParams): Transaction => {
  const txToStore = isExecution
    ? transaction.withMutations((tx) => {
        tx.set('executionTxHash', receipt.transactionHash)
          .set('blockNumber', receipt.blockNumber)
          .set('executionDate', tx.submissionDate)
          .set('fee', web3ReadOnly.utils.toWei(`${receipt.gasUsed}`, 'gwei'))
          .set('executor', from)
          .set('isExecuted', true)
          .set('isSuccessful', receipt.status)
          .set('status', receipt.status ? TransactionStatus.SUCCESS : TransactionStatus.FAILED)
      })
    : transaction.set('status', TransactionStatus.AWAITING_CONFIRMATIONS)

  return txToStore.withMutations((tx) => {
    const senderHasAlreadyConfirmed = tx.confirmations.findIndex(({ owner }) => sameAddress(owner, from)) !== -1

    if (!senderHasAlreadyConfirmed) {
      // updates confirmations status
      tx.update('confirmations', (confirmations) => confirmations.push(makeConfirmation({ owner: from })))
    }

    tx.updateIn(['ownersWithPendingActions', 'reject'], (prev) => prev.clear()).updateIn(
      ['ownersWithPendingActions', 'confirm'],
      (prev) => prev.clear(),
    )
  })
}

type StoreTxParams = {
  transaction: Transaction
  safeAddress: string
  dispatch: Dispatch
  state: AppReduxState
}

export const storeTx = async ({ transaction, safeAddress, dispatch, state }: StoreTxParams): Promise<void> => {
  if (transaction.isCancellationTx) {
    // `transaction` is the Cancellation tx
    // So we need to decide the `status` for the main transaction this `transaction` is cancelling
    let status: TransactionStatus = TransactionStatus.AWAITING_YOUR_CONFIRMATION
    // `cancelled`, will become true if its corresponding Cancellation tx was successfully executed
    let cancelled = false

    switch (transaction.status) {
      case TransactionStatus.SUCCESS:
        status = TransactionStatus.CANCELLED
        cancelled = true
        break
      case TransactionStatus.PENDING:
        status = TransactionStatus.PENDING
        break
      default:
        break
    }

    const safeTransactions = safeTransactionsSelector(state)

    const transactions = safeTransactions.withMutations((txs) => {
      const txIndex = txs.findIndex(({ nonce }) => Number(nonce) === Number(transaction.nonce))
      txs.update(txIndex, (tx) => tx.set('status', status).set('cancelled', cancelled))
    })

    batch(() => {
      dispatch(
        addOrUpdateCancellationTransactions({
          safeAddress,
          transactions: Map({ [`${transaction.nonce}`]: transaction }),
        }),
      )
      dispatch(addOrUpdateTransactions({ safeAddress, transactions }))
    })
  } else {
    dispatch(addOrUpdateTransactions({ safeAddress, transactions: List([transaction]) }))
  }
}

type StoreSignedTxParams = StoreTxParams & {
  from: string
  isExecution: boolean
}

export const storeSignedTx = ({ transaction, from, isExecution, ...rest }: StoreSignedTxParams): Promise<void> =>
  storeTx({
    transaction: isExecution ? setTxStatusAsPending({ transaction, from }) : transaction,
    ...rest,
  })

type StoreExecParams = StoreTxParams & {
  from: string
  isExecution: boolean
  safeAddress: string
  receipt: TransactionReceipt
}

export const storeExecutedTx = ({ safeAddress, dispatch, state, ...rest }: StoreExecParams): Promise<void> =>
  storeTx({
    transaction: updateTxBasedOnReceipt({ ...rest }),
    safeAddress,
    dispatch,
    state,
  })

export const removeTxFromStore = (
  transaction: Transaction,
  safeAddress: string,
  dispatch: Dispatch,
  state: AppReduxState,
): void => {
  if (transaction.isCancellationTx) {
    const safeTransactions = safeTransactionsSelector(state)
    const transactions = safeTransactions.withMutations((txs) => {
      const txIndex = txs.findIndex(({ nonce }) => Number(nonce) === Number(transaction.nonce))
      txs[txIndex].set('status', TransactionStatus.AWAITING_YOUR_CONFIRMATION)
    })

    batch(() => {
      dispatch(addOrUpdateTransactions({ safeAddress, transactions }))
      dispatch(removeCancellationTransaction({ safeAddress, transaction }))
    })
  } else {
    dispatch(removeTransaction({ safeAddress, transaction }))
  }
}
