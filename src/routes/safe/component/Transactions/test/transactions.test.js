// @flow
import { List, Map } from 'immutable'
import { createTransaction } from '~/routes/safe/component/Transactions/transactions'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner } from '~/routes/safe/store/model/owner'
import { loadSafeTransactions } from '~/routes/safe/store/actions/fetchTransactions'
import { testSizeOfSafesWith, testSizeOfTransactions, testTransactionFrom } from './transactionsHelper'

describe('Transactions Suite', () => {
  let safe: Safe
  let destination: string
  let value: number
  let owners: List<Owner>
  beforeEach(async () => {
    localStorage.clear()

    safe = SafeFactory.twoOwnersSafe('foo', 'bar')
    destination = 'baz'
    value = 2
    owners = safe.get('owners')

    const firstOwner = owners.get(0)
    if (!firstOwner) { throw new Error() }
    const secondOwner = owners.get(1)
    if (!secondOwner) { throw new Error() }
  })

  it('adds first confirmation to stored safe', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    createTransaction(txName, nonce, destination, value, 'foo', owners, '', safe.get('name'), safe.get('address'), safe.get('confirmations'))

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)

    const safeTransactions: List<Transaction> | typeof undefined = transactions.get(safe.get('address'))
    if (!safeTransactions) { throw new Error() }
    testSizeOfTransactions(safeTransactions, 1)

    testTransactionFrom(safeTransactions, 0, txName, nonce, value, 2, destination, 'foo', owners.get(0), owners.get(1))
  })

  it('adds second confirmation to stored safe with one confirmation', async () => {
    // GIVEN
    const firstTxName = 'Buy butteries for project'
    const firstNonce: number = Date.now()
    const safeAddress = safe.get('address')
    createTransaction(firstTxName, firstNonce, destination, value, 'foo', owners, '', safe.get('name'), safeAddress, safe.get('confirmations'))

    const secondTxName = 'Buy printers for project'
    const secondNonce: number = firstNonce + 100
    createTransaction(secondTxName, secondNonce, destination, value, 'foo', owners, '', safe.get('name'), safeAddress, safe.get('confirmations'))

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)

    const safeTxs: List<Transaction> | typeof undefined = transactions.get(safeAddress)
    if (!safeTxs) { throw new Error() }
    testSizeOfTransactions(safeTxs, 2)

    testTransactionFrom(safeTxs, 0, firstTxName, firstNonce, value, 2, destination, 'foo', owners.get(0), owners.get(1))
    testTransactionFrom(safeTxs, 1, secondTxName, secondNonce, value, 2, destination, 'foo', owners.get(0), owners.get(1))
  })

  it('adds second confirmation to stored safe having two safes with one confirmation each', async () => {
    const txName = 'Buy batteris for Alplha project'
    const nonce = 10
    const safeAddress = safe.address
    createTransaction(txName, nonce, destination, value, 'foo', owners, '', safe.get('name'), safeAddress, safe.get('confirmations'))

    const secondSafe = SafeFactory.dailyLimitSafe(10, 2)
    const txSecondName = 'Buy batteris for Beta project'
    const txSecondNonce = 10
    const secondSafeAddress = secondSafe.address
    createTransaction(
      txSecondName, txSecondNonce, destination, value, '0x03db1a8b26d08df23337e9276a36b474510f0023',
      secondSafe.get('owners'), '', secondSafe.get('name'), secondSafeAddress, secondSafe.get('confirmations'),
    )

    let transactions: Map<string, List<Transaction>> = loadSafeTransactions()
    testSizeOfSafesWith(transactions, 2)

    const firstSafeTxs: List<Transaction> | typeof undefined = transactions.get(safeAddress)
    if (!firstSafeTxs) { throw new Error() }
    testSizeOfTransactions(firstSafeTxs, 1)

    const secondSafeTxs: List<Transaction> | typeof undefined = transactions.get(secondSafeAddress)
    if (!secondSafeTxs) { throw new Error() }
    testSizeOfTransactions(secondSafeTxs, 1)

    // WHEN
    const txFirstName = 'Buy paper for Alplha project'
    const txFirstNonce = 11
    createTransaction(
      txFirstName, txFirstNonce, destination, value, 'foo',
      safe.get('owners'), '', safe.get('name'), safe.get('address'), safe.get('confirmations'),
    )

    transactions = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 2)
    testSizeOfTransactions(transactions.get(safeAddress), 2)
    testSizeOfTransactions(transactions.get(secondSafeAddress), 1)

    // Test 2 transactions of first safe
    testTransactionFrom(
      transactions.get(safe.address), 0,
      txName, nonce, value, 2, destination,
      'foo', owners.get(0), owners.get(1),
    )
    testTransactionFrom(
      transactions.get(safe.address), 1,
      txFirstName, txFirstNonce, value, 2, destination,
      'foo', owners.get(0), owners.get(1),
    )

    // Test one transaction of second safe
    testTransactionFrom(
      transactions.get(secondSafe.address), 0,
      txSecondName, txSecondNonce, value, 2, destination,
      '0x03db1a8b26d08df23337e9276a36b474510f0023', secondSafe.get('owners').get(0), secondSafe.get('owners').get(1),
    )
  })

  it('does not allow to store same transaction twice', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    createTransaction(txName, nonce, destination, value, 'foo', owners, '', safe.get('name'), safe.get('address'), safe.get('confirmations'))

    // WHEN
    const createTxFnc = () => createTransaction(txName, nonce, destination, value, 'foo', owners, '', safe.get('name'), safe.get('address'), safe.get('confirmations'))
    expect(createTxFnc).toThrow(/Transaction with same nonce/)
  })

  it('checks the owner who creates the tx has confirmed it', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    createTransaction(txName, nonce, destination, value, 'foo', owners, '', safe.get('name'), safe.get('address'), safe.get('confirmations'))

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)
  })

  it('checks the owner who creates the tx is an owner', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const ownerName = 'invented'
    const createTxFnc = () => createTransaction(txName, nonce, destination, value, ownerName, owners, '', safe.get('name'), safe.get('address'), safe.get('confirmations'))

    expect(createTxFnc).toThrow(/The creator of the tx is not an owner/)
  })

  it('checks if safe has one owner transaction has been executed', async () => {
    const ownerName = 'foo'
    const oneOwnerSafe = SafeFactory.oneOwnerSafe(ownerName)
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const tx = ''
    const createTxFnc = () => createTransaction(txName, nonce, destination, value, ownerName, oneOwnerSafe.get('owners'), tx, oneOwnerSafe.get('name'), oneOwnerSafe.get('address'), oneOwnerSafe.get('confirmations'))

    expect(createTxFnc).toThrow(/The tx should be mined before storing it in safes with one owner/)
  })
})

