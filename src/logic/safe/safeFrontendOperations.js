// @flow
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { executeDailyLimit, executeTransaction, approveTransaction } from '~/logic/safe/safeBlockchainOperations'
import { EMPTY_DATA } from '~/logic/wallets/ethTransactions'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdraw/WithdrawForm'
import { type Safe } from '~/routes/safe/store/model/safe'
import { getGnosisSafeContract } from '~/logic/contracts/safeContracts'
import { storeSubject } from '~/utils/localStorage/transactions'

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

export const getSafeEthereumInstance = async (safeAddress: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  return GnosisSafe.at(safeAddress)
}

export const createTransaction = async (
  safe: Safe,
  name: string,
  to: string,
  value: number,
  nonce: number,
  sender: string,
  data: string = EMPTY_DATA,
) => {
  const web3 = getWeb3()
  const safeAddress = safe.get('address')
  const threshold = safe.get('threshold')
  const valueInWei = web3.toWei(value, 'ether')
  const CALL = 0

  const isExecution = hasOneOwner(safe) || threshold === 1

  const txHash = isExecution
    ? await executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
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
) => {
  const web3 = getWeb3()
  const nonce = tx.get('nonce')
  const valueInWei = web3.toWei(tx.get('value'), 'ether')
  const to = tx.get('destination')
  const data = tx.get('data')
  const CALL = 0

  const thresholdReached = threshold === alreadyConfirmed + 1
  const txHash = thresholdReached
    ? await executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
    : await approveTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)

  return txHash
}

export const withdraw = async (values: Object, safe: Safe, sender: string): Promise<void> => {
  const safeAddress = safe.get('address')
  const destination = values[DESTINATION_PARAM]
  const valueInEth = values[VALUE_PARAM]
  const valueInWei = getWeb3().toWei(valueInEth, 'ether')
  const nonce = Date.now()
  const txHash = await executeDailyLimit(safeAddress, destination, nonce, valueInWei, sender)

  storeSubject(safeAddress, nonce, `Withdraw movement of ${valueInEth}`)

  return txHash
}
