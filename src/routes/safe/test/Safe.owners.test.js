// @flow
import { aNewStore } from '~/store'
import { aDeployedSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { getWeb3 } from '~/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { type Match } from 'react-router-dom'
import { promisify } from '~/utils/promisify'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import { confirmationsTransactionSelector, safeSelector, safeTransactionsSelector } from '~/routes/safe/store/selectors/index'
import { getTransactionFromReduxStore } from '~/routes/safe/test/testMultisig'
import { buildMathPropsFrom } from '~/test/buildReactRouterProps'
import { createTransaction } from '~/routes/safe/component/AddTransaction/createTransactions'
import { getGnosisSafeContract } from '~/wallets/safeContracts'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type GlobalState } from '~/store/index'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Transaction } from '~/routes/safe/store/model/transaction'

const getSafeFrom = (state: GlobalState, safeAddress: string): Safe => {
  const match: Match = buildMathPropsFrom(safeAddress)
  const safe = safeSelector(state, { match })
  if (!safe) throw new Error()

  return safe
}

const getGnosisSafeInstanceAt = async (safeAddress: string) => {
  const web3 = getWeb3()
  const GnosisSafe = await getGnosisSafeContract(web3)
  const gnosisSafe = GnosisSafe.at(safeAddress)

  return gnosisSafe
}

describe('React DOM TESTS > Add and remove owners', () => {
  const assureExecuted = (transaction: Transaction) => {
    expect(transaction.get('tx')).not.toBe(null)
    expect(transaction.get('tx')).not.toBe(undefined)
    expect(transaction.get('tx')).not.toBe('')
  }

  const assureThresholdIs = async (gnosisSafe, threshold: number) => {
    const safeThreshold = await gnosisSafe.getThreshold()
    expect(Number(safeThreshold)).toEqual(threshold)
  }

  const assureOwnersAre = async (gnosisSafe, ...owners) => {
    const safeOwners = await gnosisSafe.getOwners()
    expect(safeOwners.length).toEqual(owners.length)
    for (let i = 0; i < owners.length; i += 1) {
      expect(safeOwners[i]).toBe(owners[i])
    }
  }

  it('adds owner without increasing the threshold', async () => {
    // GIVEN
    const numOwners = 2
    const threshold = 1
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const safe = getSafeFrom(store.getState(), address)
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    // WHEN
    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])
    const nonce = Date.now()
    const accountIndex = 5
    const data = gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[accountIndex], 1)
    await createTransaction(safe, `Add Owner with index ${accountIndex}`, address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await store.dispatch(fetchTransactions())

    // THEN
    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    expect(transactions.count()).toBe(1)
    const tx = transactions.get(0)
    if (!tx) throw new Error()
    assureExecuted(tx)
    await assureOwnersAre(gnosisSafe, accounts[5], accounts[0], accounts[1])
    await assureThresholdIs(gnosisSafe, 1)
  })

  it('adds owner increasing the threshold', async () => {
    // GIVEN
    const numOwners = 2
    const threshold = 1
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const safe = getSafeFrom(store.getState(), address)
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    // WHEN
    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])
    const nonce = Date.now()
    const accountIndex = 5
    const data = gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[accountIndex], 2)
    await createTransaction(safe, `Add Owner with index ${accountIndex}`, address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await store.dispatch(fetchTransactions())

    // THEN
    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    expect(transactions.count()).toBe(1)
    const tx = transactions.get(0)
    if (!tx) throw new Error()
    assureExecuted(tx)
    await assureOwnersAre(gnosisSafe, accounts[accountIndex], accounts[0], accounts[1])
    await assureThresholdIs(gnosisSafe, 2)
  })

  const processOwnerModification = async (store, safeAddress, executor) => {
    const tx = getTransactionFromReduxStore(store, safeAddress)
    if (!tx) throw new Error()
    const confirmed = confirmationsTransactionSelector(store.getState(), { transaction: tx })
    const data = tx.get('data')
    expect(data).not.toBe(null)
    expect(data).not.toBe(undefined)
    expect(data).not.toBe('')

    await processTransaction(safeAddress, tx, confirmed, executor)
    await sleep(1800)
  }

  it('remove owner without decreasing the threshold', async () => {
    // GIVEN
    const numOwners = 3
    const threshold = 2
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const safe = getSafeFrom(store.getState(), address)
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    // WHEN
    await assureThresholdIs(gnosisSafe, 2)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1], accounts[2])
    const nonce = Date.now()
    const accountIndex = 2
    const data = gnosisSafe.contract.removeOwner.getData(accounts[accountIndex - 1], accounts[accountIndex], 2)
    await createTransaction(safe, `Remove owner Address 3 ${nonce}`, address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1], accounts[2])
    await store.dispatch(fetchTransactions())


    processOwnerModification(store, address, accounts[1])
    await sleep(3000)
    await store.dispatch(fetchTransactions())
    await sleep(3000)
    const tx = getTransactionFromReduxStore(store, address)
    if (!tx) throw new Error()
    const txHash = tx.get('tx')
    expect(txHash).not.toBe('')
    await assureThresholdIs(gnosisSafe, 2)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])
  })

  it('remove owner decreasing the threshold', async () => {
    // GIVEN
    const numOwners = 2
    const threshold = 2
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const safe = getSafeFrom(store.getState(), address)
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    // WHEN
    await assureThresholdIs(gnosisSafe, 2)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])
    const nonce = Date.now()
    const accountIndex = 1
    const data = gnosisSafe.contract.removeOwner.getData(accounts[accountIndex - 1], accounts[accountIndex], 1)
    await createTransaction(safe, `Remove owner Address 2 ${nonce}`, address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])
    await store.dispatch(fetchTransactions())


    processOwnerModification(store, address, accounts[1])
    await sleep(3000)
    await store.dispatch(fetchTransactions())
    await sleep(3000)
    const tx = getTransactionFromReduxStore(store, address)
    if (!tx) throw new Error()
    const txHash = tx.get('tx')
    expect(txHash).not.toBe('')
    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[0])
  })
})
