// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import showSnackbarMsg from '~/components/Snackbar/store/actions/showSnackbarMsg'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { approveTransaction, executeTransaction, CALL } from '~/logic/safe/transactions'

// https://gnosis-safe.readthedocs.io/en/latest/contracts/signatures.html#pre-validated-signatures
// https://github.com/gnosis/safe-contracts/blob/master/test/gnosisSafeTeamEdition.js#L26
const generateSignaturesFromTxConfirmations = (tx: Transaction, preApprovingOwner?: string) => {
  // The constant parts need to be sorted so that the recovered signers are sorted ascending
  // (natural order) by address (not checksummed).
  let confirmedAdresses = tx.confirmations.map(conf => conf.owner.address)

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
  if (shouldExecute) {
    dispatch(showSnackbarMsg('Transaction has been submitted', 'success'))
    txHash = await executeTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from, sigs)
    dispatch(showSnackbarMsg('Transaction has been confirmed', 'success'))
  } else {
    dispatch(showSnackbarMsg('Approval transaction has been submitted', 'success'))
    txHash = await approveTransaction(safeInstance, tx.recipient, tx.value, tx.data, CALL, nonce, from)
    dispatch(showSnackbarMsg('Approval transaction has been confirmed', 'success'))
  }

  if (!process.env.NODE_ENV === 'test') {
    dispatch(fetchTransactions(safeAddress))
  }

  return txHash
}

export default processTransaction
