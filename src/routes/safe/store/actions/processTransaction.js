// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import {
  getApprovalTransaction,
  getExecutionTransaction,
  CALL,
  saveTxToHistory,
  TX_TYPE_EXECUTION,
  TX_TYPE_CONFIRMATION,
} from '~/logic/safe/transactions'

// https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
// https://github.com/gnosis/safe-contracts/blob/master/test/gnosisSafeTeamEdition.js#L26
const generateSignaturesFromTxConfirmations = (tx: Transaction, preApprovingOwner?: string) => {
  // The constant parts need to be sorted so that the recovered signers are sorted ascending
  // (natural order) by address (not checksummed).
  let confirmedAdresses = tx.confirmations.map((conf) => conf.owner.address)

  if (preApprovingOwner) {
    confirmedAdresses = confirmedAdresses.push(preApprovingOwner)
  }

  let sigs = '0x'
  confirmedAdresses.sort().forEach((addr) => {
    sigs += `000000000000000000000000${addr.replace(
      '0x',
      '',
    )}000000000000000000000000000000000000000000000000000000000000000001`
  })
  return sigs
}

const processTransaction = (
  safeAddress: string,
  tx: Transaction,
  openSnackbar: Function,
  userAddress: string,
  approveAndExecute?: boolean,
) => async (dispatch: ReduxDispatch<GlobalState>, getState: GetState<GlobalState>) => {
  const state: GlobalState = getState()

  const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
  const from = userAccountSelector(state)
  const nonce = (await safeInstance.nonce()).toString()
  const threshold = (await safeInstance.getThreshold()).toNumber()
  const shouldExecute = threshold === tx.confirmations.size || approveAndExecute
  const sigs = generateSignaturesFromTxConfirmations(tx, approveAndExecute && userAddress)

  let txHash
  let transaction
  if (shouldExecute) {
    transaction = await getExecutionTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from, sigs)
  } else {
    transaction = await getApprovalTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from)
  }

  await transaction
    .send({
      from,
    })
    .once('transactionHash', (hash) => {
      txHash = hash
      openSnackbar(
        shouldExecute ? 'Transaction has been submitted' : 'Approval transaction has been submitted',
        'success',
      )
    })
    .on('error', (error) => {
      console.error('Processing transaction error: ', error)
    })
    .then(async (receipt) => {
      await saveTxToHistory(
        safeInstance,
        tx.recipient,
        tx.value,
        tx.data,
        CALL,
        nonce,
        receipt.transactionHash,
        from,
        shouldExecute ? TX_TYPE_EXECUTION : TX_TYPE_CONFIRMATION,
      )

      return receipt.transactionHash
    })

  openSnackbar(shouldExecute ? 'Transaction has been confirmed' : 'Approval transaction has been confirmed', 'success')

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default processTransaction
