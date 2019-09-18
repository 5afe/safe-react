// @flow
import type { Dispatch as ReduxDispatch, GetState } from 'redux'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { userAccountSelector } from '~/logic/wallets/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { approveTransaction, executeTransaction, CALL } from '~/logic/safe/transactions'
import { type Variant, SUCCESS } from '~/components/Header'

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
  enqueueSnackbar: (message: string, variant: Variant) => void,
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
    const showNotification = () => enqueueSnackbar('Transaction has been submitted', { variant: SUCCESS })
    txHash = await executeTransaction(
      showNotification,
      safeInstance,
      tx.recipient,
      tx.value,
      tx.data,
      CALL,
      nonce,
      from,
      sigs,
    )
    enqueueSnackbar('Transaction has been confirmed', { variant: SUCCESS })
  } else {
    const showNotification = () => enqueueSnackbar('Approval transaction has been submitted', { variant: SUCCESS })
    txHash = await approveTransaction(
      showNotification,
      safeInstance,
      tx.recipient,
      tx.value,
      tx.data,
      CALL,
      nonce,
      from,
    )
    enqueueSnackbar('Approval transaction has been confirmed', { variant: SUCCESS })
  }

  dispatch(fetchTransactions(safeAddress))

  return txHash
}

export default processTransaction
