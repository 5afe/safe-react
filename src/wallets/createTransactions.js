// @flow
import { List } from 'immutable'
import { type Owner } from '~/routes/safe/store/model/owner'
import { load, TX_KEY } from '~/utils/localStorage'
import { type Confirmation, makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { makeTransaction, type Transaction, type TransactionProps } from '~/routes/safe/store/model/transaction'
import { getGnosisSafeContract } from '~/wallets/safeContracts'
import { getWeb3 } from '~/wallets/getWeb3'
import { type Safe } from '~/routes/safe/store/model/safe'
import { sameAddress } from '~/wallets/ethAddresses'
import { EMPTY_DATA } from '~/wallets/ethTransactions'
import { storeSubject } from '~/utils/localStorage/transactions'
import { executeTransaction, approveTransaction } from '~/wallets/safeOperations'

export const TX_NAME_PARAM = 'txName'
export const TX_DESTINATION_PARAM = 'txDestination'
export const TX_VALUE_PARAM = 'txValue'

export const EXECUTED_CONFIRMATION_HASH = 'EXECUTED'

// Exported for testing it, should not use it. Use #transactions fnc.
export const buildConfirmationsFrom =
  (owners: List<Owner>, creator: string, confirmationHash: string): List<Confirmation> => {
    if (!owners) {
      throw new Error('This safe has no owners')
    }

    if (!owners.find((owner: Owner) => sameAddress(owner.get('address'), creator))) {
      throw new Error('The creator of the tx is not an owner')
    }

    return owners.map((owner: Owner) => makeConfirmation({
      owner,
      status: sameAddress(owner.get('address'), creator),
      hash: sameAddress(owner.get('address'), creator) ? confirmationHash : undefined,
    }))
  }

export const buildExecutedConfirmationFrom = (owners: List<Owner>, creator: string): List<Confirmation> =>
  buildConfirmationsFrom(owners, creator, EXECUTED_CONFIRMATION_HASH)

export const storeTransaction = (
  name: string,
  nonce: number,
  destination: string,
  value: number,
  creator: string,
  confirmations: List<Confirmation>,
  tx: string,
  safeAddress: string,
  safeThreshold: number,
  data: string,
) => {
  const notMinedWhenOneOwnerSafe = confirmations.count() === 1 && !tx
  if (notMinedWhenOneOwnerSafe) {
    throw new Error('The tx should be mined before storing it in safes with one owner')
  }
  // fetch actual transactions from endpoint and check nonce is higher than the last one
  // send tx to service
  // store subject in local storage (for testing it the actual name should be '')

  const transaction: Transaction = makeTransaction({
    name: '', nonce, value, confirmations, destination, threshold: safeThreshold, tx, data,
  })

  const safeTransactions = load(TX_KEY) || {}
  const transactions = safeTransactions[safeAddress]
  const txsRecord = transactions ? List(transactions) : List([])

  if (txsRecord.find((txs: TransactionProps) => txs.nonce === nonce)) {
    throw new Error(`Transaction with same nonce: ${nonce} already created for safe: ${safeAddress}`)
  }

  storeSubject(safeAddress, nonce, name)

  safeTransactions[safeAddress] = txsRecord.push(transaction)
  localStorage.setItem(TX_KEY, JSON.stringify(safeTransactions))
}

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
  const owners = safe.get('owners')
  const safeAddress = safe.get('address')
  const threshold = safe.get('threshold')
  const valueInWei = web3.toWei(value, 'ether')
  const CALL = 0

  const isExecution = hasOneOwner(safe) || threshold === 1
  if (isExecution) {
    const txHash = await executeTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
    // TODO Remove when TX History service is fully integrated
    const executedConfirmations: List<Confirmation> = buildExecutedConfirmationFrom(owners, sender)

    // TODO Remove when TX History service is fully integrated
    return storeTransaction(name, nonce, to, value, sender, executedConfirmations, txHash, safeAddress, threshold, data)
  }

  const txHash = await approveTransaction(safeAddress, to, valueInWei, data, CALL, nonce, sender)
  // TODO Remove when TX History service is fully integrated
  const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, to, txHash)

  // TODO Remove when TX History service is fully integrated
  return storeTransaction(name, nonce, to, value, sender, confirmations, '', safeAddress, threshold, data)
}
