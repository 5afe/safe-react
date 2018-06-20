// @flow
import { List } from 'immutable'
import { type Owner } from '~/routes/safe/store/model/owner'
import { load, TX_KEY } from '~/utils/localStorage'
import { type Confirmation, makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { makeTransaction, type Transaction, type TransactionProps } from '~/routes/safe/store/model/transaction'
import { getGnosisSafeContract } from '~/wallets/safeContracts'
import { getWeb3 } from '~/wallets/getWeb3'
import { sameAddress } from '~/wallets/ethAddresses'
import { EXECUTED_CONFIRMATION_HASH } from '~/routes/safe/component/AddTransaction/createTransactions'
import { checkReceiptStatus, calculateGasOf, calculateGasPrice } from '~/wallets/ethTransactions'

export const updateTransaction = (
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
  const transaction: Transaction = makeTransaction({
    name, nonce, value, confirmations, destination, threshold: safeThreshold, tx, data,
  })

  const safeTransactions = load(TX_KEY) || {}
  const transactions = safeTransactions[safeAddress]
  const txsRecord = transactions ? List(transactions) : List([])

  const index = txsRecord.findIndex((trans: TransactionProps) => trans.nonce === nonce)

  safeTransactions[safeAddress] = txsRecord.remove(index).push(transaction)

  localStorage.setItem(TX_KEY, JSON.stringify(safeTransactions))
}

const getOperation = () => 0

const execTransaction = async (
  gnosisSafe: any,
  destination: string,
  txValue: number,
  nonce: number,
  executor: string,
  data: string,
) => {
  const CALL = getOperation()
  const web3 = getWeb3()
  const valueInWei = web3.toWei(txValue, 'ether')

  const txData = await gnosisSafe.contract.execTransactionIfApproved.getData(destination, valueInWei, data, CALL, nonce)
  const owners = await gnosisSafe.getOwners()
  const gas = await calculateGasOf(txData, executor, gnosisSafe.address) + (17000 * owners.length)
  const gasPrice = await calculateGasPrice()

  return gnosisSafe
    .execTransactionIfApproved(destination, valueInWei, data, CALL, nonce, { from: executor, gas, gasPrice })
}

const execConfirmation = async (
  gnosisSafe: any,
  txDestination: string,
  txValue: number,
  nonce: number,
  executor: string,
  data: string,
) => {
  const CALL = getOperation()
  const web3 = getWeb3()
  const valueInWei = web3.toWei(txValue, 'ether')
  const txData = await gnosisSafe.contract
    .approveTransactionWithParameters.getData(txDestination, valueInWei, data, CALL, nonce)
  const gas = await calculateGasOf(txData, executor, gnosisSafe.address)
  const gasPrice = await calculateGasPrice()

  return gnosisSafe
    .approveTransactionWithParameters(txDestination, valueInWei, data, CALL, nonce, { from: executor, gas, gasPrice })
}

const updateConfirmations = (confirmations: List<Confirmation>, userAddress: string, txHash: string) =>
  confirmations.map((confirmation: Confirmation) => {
    const owner: Owner = confirmation.get('owner')
    const samePerson = sameAddress(owner.get('address'), userAddress)
    const status: boolean = samePerson ? true : confirmation.get('status')
    const hash: string = samePerson ? txHash : confirmation.get('hash')

    return makeConfirmation({ owner, status, hash })
  })

export const processTransaction = async (
  safeAddress: string,
  tx: Transaction,
  alreadyConfirmed: number,
  userAddress: string,
) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)

  const confirmations = tx.get('confirmations')
  const userHasAlreadyConfirmed = confirmations.filter((confirmation: Confirmation) => {
    const ownerAddress = confirmation.get('owner').get('address')
    const samePerson = sameAddress(ownerAddress, userAddress)

    return samePerson && confirmation.get('status')
  }).count() > 0

  if (userHasAlreadyConfirmed) {
    throw new Error('Owner has already confirmed this transaction')
  }

  const threshold = tx.get('threshold')
  const thresholdReached = threshold === alreadyConfirmed + 1
  const nonce = tx.get('nonce')
  const txName = tx.get('name')
  const txValue = tx.get('value')
  const txDestination = tx.get('destination')
  const data = tx.get('data')

  const txHash = thresholdReached
    ? await execTransaction(gnosisSafe, txDestination, txValue, nonce, userAddress, data)
    : await execConfirmation(gnosisSafe, txDestination, txValue, nonce, userAddress, data)

  checkReceiptStatus(txHash.tx)

  const confirmationHash = thresholdReached ? EXECUTED_CONFIRMATION_HASH : txHash.tx
  const executedConfirmations: List<Confirmation> = updateConfirmations(tx.get('confirmations'), userAddress, confirmationHash)

  return updateTransaction(
    txName,
    nonce,
    txDestination,
    txValue,
    userAddress,
    executedConfirmations,
    thresholdReached ? txHash.tx : '',
    safeAddress,
    threshold,
    data,
  )
}
