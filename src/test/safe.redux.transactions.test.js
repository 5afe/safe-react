// @flow
import { List } from 'immutable'
import { getSafeEthereumInstance, createTransaction } from '~/logic/safe/safeFrontendOperations'
import { type Safe } from '~/routes/safe/store/model/safe'
import { makeOwner } from '~/routes/safe/store/model/owner'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { makeConfirmation } from '~/routes/safe/store/model/confirmation'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { getSafeFrom } from '~/test/utils/safeHelper'
import { promisify } from '~/utils/promisify'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { safeTransactionsSelector } from '~/routes/safe/store/selectors'
import { testTransactionFrom, testSizeOfTransactions } from './utils/historyServiceHelper'

describe('Transactions Suite', () => {
  let store: Store
  let safeAddress: string
  let accounts: string[]
  beforeAll(async () => {
    accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  })
  beforeEach(async () => {
    localStorage.clear()

    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it('retrieves tx info from service having subject available', async () => {
    const safe: Safe = getSafeFrom(store.getState(), safeAddress)
    const gnosisSafe = await getSafeEthereumInstance(safeAddress)
    const firstTxData = gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[1], 2)
    const executor = accounts[0]
    const nonce = Date.now()
    const firstTxHash = await createTransaction(safe, 'Add Owner Second account', safeAddress, 0, nonce, executor, firstTxData)
    const secondTxData = gnosisSafe.contract.addOwnerWithThreshold.getData(accounts[2], 2)
    const secondTxHash = await createTransaction(safe, 'Add Owner Third account', safeAddress, 0, nonce + 100, executor, secondTxData)

    // WHEN
    store.dispatch(fetchTransactions())
    let transactions = safeTransactionsSelector(store.getState(), { safeAddress })
    testSizeOfTransactions(transactions, 2)

    // THEN
    const firstTxConfirmations = List([
      makeConfirmation({
        owner: makeOwner({ address: executor }),
        type: 'execution',
        hash: firstTxHash,
      }),
    ])
    testTransactionFrom(transactions, 0, 'Add Owner Second account', nonce, 0, safeAddress, firstTxData, true, firstTxConfirmations)

    const secondTxConfirmations = List([
      makeConfirmation({
        owner: makeOwner({ address: accounts[0] }),
        type: 'confirmation',
        hash: secondTxHash,
      }),
    ])
    testTransactionFrom(transactions, 1, 'Add Owner Third account', nonce + 100, 0, safeAddress, secondTxData, false, secondTxConfirmations)

    localStorage.clear()

    store.dispatch(fetchTransactions())
    transactions = safeTransactionsSelector(store.getState(), { safeAddress })
    testSizeOfTransactions(transactions, 2)
    testTransactionFrom(transactions, 0, 'Unknown', nonce, 0, safeAddress, firstTxData, true, firstTxConfirmations)
    testTransactionFrom(transactions, 1, 'Unknown', nonce + 100, 0, safeAddress, secondTxData, false, secondTxConfirmations)
  })

  it('returns empty list of trnsactions when safe is not configured', async () => {
    // routes/safe/transactions.selector.js the 4 cases
    // confirmations.selector.js the last one
  })

  it('pending transactions are treated correctly', async () => {
    // create a safe 3 owners 3 threshold
    // create a tx adding 4th owner
    // confirm tx and check on every step
  })

  it('returns count of confirmed but not executed txs', async () => {
    // pendingTransactionSelector
  })

  it('returns count of executed txs', async () => {
    // confirmationsTransactionSelector
  })

  it('returns correctly transaction list when safe is not available', async () => {
    // routes/safe/test/transactions.selector.js
  })

  it('process only updated txs', async () => {
    // Basically I would like when I call the GET TXs endpoint to retrieve those transactions ORDERED based on
    // when they have been updated (just created, or just added another extra confirmation).
    // In that way I do not need to parse and threat all txs in client side and also we mitigate the risk of
    // do not get old txs updates. For doing that I would need to keep stored a number indicating
    // if the tx has been updated in DB.
    // For instance:
    /*
      create tx1            ---> [{ tx:1, updated: 1 }]
      create tx2            ---> [{ tx:2, updated: 1 }, { tx:1, updated: 1 }]
      user 2 confirms tx1   ---> [{ tx:1, updated: 2 }, { tx:2, updated: 1 }]

      In that way I keep stored tx1 -> 1 and if I see tx2 -> 2 I do not skip it
    */
  })
})

