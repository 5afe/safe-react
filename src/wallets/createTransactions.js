// @flow
import { getGnosisSafeContract } from '~/wallets/safeContracts'
import { getWeb3 } from '~/wallets/getWeb3'
import { type Safe } from '~/routes/safe/store/model/safe'
import { EMPTY_DATA } from '~/wallets/ethTransactions'
import { executeTransaction, approveTransaction } from '~/wallets/safeOperations'

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

  return isExecution
    ? executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
    : approveTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
}
