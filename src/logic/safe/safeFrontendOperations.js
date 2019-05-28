// @flow
import { List } from 'immutable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { executeTransaction, approveTransaction } from '~/logic/safe/safeBlockchainOperations'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Safe } from '~/routes/safe/store/models/safe'
import { storeSubject } from '~/utils/storage/transactions'

export const TX_NAME_PARAM = 'txName'
export const TX_DESTINATION_PARAM = 'txDestination'
export const TX_VALUE_PARAM = 'txValue'

export const EXECUTED_CONFIRMATION_HASH = 'EXECUTED'

const hasOneOwner = (safe: Safe) => {
  const owners = safe.get('owners')
  if (!owners) {
    throw new Error('Received a Safe without owners when creating a tx')
  }

  return owners.count() === 1
}

export const createTransaction = async (
  safe: Safe,
  name: string,
  to: string,
  value: string,
  nonce: number,
  sender: string,
  data: string = EMPTY_DATA,
) => {
  const web3 = getWeb3()
  const safeAddress = safe.get('address')
  const threshold = safe.get('threshold')
  const valueInWei = web3.utils.toWei(value, 'ether')
  const CALL = 0

  const isExecution = hasOneOwner(safe) || threshold === 1

  const txHash = isExecution
    ? await executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender, List([]))
    : await approveTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)

  storeSubject(safeAddress, nonce, name)

  return txHash
}

export const processTransaction = async (
  safeAddress: string,
  tx: Transaction,
  alreadyConfirmed: number,
  sender: string,
  threshold: number,
  usersConfirmed: List<string>,
) => {
  const nonce = tx.get('nonce')
  const valueInWei = tx.get('value')
  const to = tx.get('destination')
  const data = tx.get('data')
  const CALL = 0

  const thresholdReached = threshold === alreadyConfirmed + 1
  const txHash = thresholdReached
    ? await executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender, usersConfirmed)
    : await approveTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)

  return txHash
}
