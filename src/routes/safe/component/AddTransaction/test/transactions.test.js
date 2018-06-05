// @flow
import { List, Map } from 'immutable'
import { storeTransaction, buildConfirmationsFrom, EXECUTED_CONFIRMATION_HASH, buildExecutedConfirmationFrom } from '~/routes/safe/component/AddTransaction/createTransactions'
import { type Transaction } from '~/routes/safe/store/model/transaction'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
import { type Safe } from '~/routes/safe/store/model/safe'
import { type Owner } from '~/routes/safe/store/model/owner'
import { loadSafeTransactions } from '~/routes/safe/store/actions/fetchTransactions'
import { type Confirmation } from '~/routes/safe/store/model/confirmation'
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
    const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, 'foo', 'confirmationHash')
    storeTransaction(txName, nonce, destination, value, 'foo', confirmations, '', safe.get('address'), safe.get('confirmations'), '0x')

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)

    const safeTransactions: List<Transaction> | typeof undefined = transactions.get(safe.get('address'))
    if (!safeTransactions) { throw new Error() }
    testSizeOfTransactions(safeTransactions, 1)

    testTransactionFrom(safeTransactions, 0, txName, nonce, value, 2, destination, '0x', 'foo', 'confirmationHash', owners.get(0), owners.get(1))
  })

  it('adds second confirmation to stored safe with one confirmation', async () => {
    // GIVEN
    const firstTxName = 'Buy butteries for project'
    const firstNonce: number = Date.now()
    const safeAddress = safe.get('address')
    const creator = 'foo'
    const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'confirmationHash')
    storeTransaction(firstTxName, firstNonce, destination, value, creator, confirmations, '', safeAddress, safe.get('confirmations'), '0x')

    const secondTxName = 'Buy printers for project'
    const secondNonce: number = firstNonce + 100
    const secondConfirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'confirmationHash')
    storeTransaction(secondTxName, secondNonce, destination, value, creator, secondConfirmations, '', safeAddress, safe.get('confirmations'), '0x')

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)

    const safeTxs: List<Transaction> | typeof undefined = transactions.get(safeAddress)
    if (!safeTxs) { throw new Error() }
    testSizeOfTransactions(safeTxs, 2)

    testTransactionFrom(safeTxs, 0, firstTxName, firstNonce, value, 2, destination, '0x', 'foo', 'confirmationHash', owners.get(0), owners.get(1))
    testTransactionFrom(safeTxs, 1, secondTxName, secondNonce, value, 2, destination, '0x', 'foo', 'confirmationHash', owners.get(0), owners.get(1))
  })

  it('adds second confirmation to stored safe having two safes with one confirmation each', async () => {
    const txName = 'Buy batteris for Alplha project'
    const nonce = 10
    const safeAddress = safe.address
    const creator = 'foo'
    const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'confirmationHash')
    storeTransaction(txName, nonce, destination, value, creator, confirmations, '', safeAddress, safe.get('confirmations'), '0x')

    const secondSafe = SafeFactory.dailyLimitSafe(10, 2)
    const txSecondName = 'Buy batteris for Beta project'
    const txSecondNonce = 10
    const secondSafeAddress = secondSafe.address
    const secondCreator = '0x03db1a8b26d08df23337e9276a36b474510f0023'
    const secondConfirmations: List<Confirmation> = buildConfirmationsFrom(secondSafe.get('owners'), secondCreator, 'confirmationHash')
    storeTransaction(
      txSecondName, txSecondNonce, destination, value, secondCreator,
      secondConfirmations, '', secondSafeAddress, secondSafe.get('confirmations'), '0x',
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
    const txConfirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'secondConfirmationHash')
    storeTransaction(
      txFirstName, txFirstNonce, destination, value, creator,
      txConfirmations, '', safe.get('address'), safe.get('confirmations'), '0x',
    )

    transactions = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 2)
    testSizeOfTransactions(transactions.get(safeAddress), 2)
    testSizeOfTransactions(transactions.get(secondSafeAddress), 1)

    // Test 2 transactions of first safe
    testTransactionFrom(
      transactions.get(safe.address), 0,
      txName, nonce, value, 2, destination, '0x',
      'foo', 'confirmationHash', owners.get(0), owners.get(1),
    )
    testTransactionFrom(
      transactions.get(safe.address), 1,
      txFirstName, txFirstNonce, value, 2, destination, '0x',
      'foo', 'secondConfirmationHash', owners.get(0), owners.get(1),
    )

    // Test one transaction of second safe
    testTransactionFrom(
      transactions.get(secondSafe.address), 0,
      txSecondName, txSecondNonce, value, 2, destination, '0x',
      '0x03db1a8b26d08df23337e9276a36b474510f0023', 'confirmationHash', secondSafe.get('owners').get(0), secondSafe.get('owners').get(1),
    )
  })

  it('does not allow to store same transaction twice', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const creator = 'foo'
    const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'confirmationHash')
    storeTransaction(txName, nonce, destination, value, creator, confirmations, '', safe.get('address'), safe.get('confirmations'), '0x')

    // WHEN
    const createTxFnc = () => storeTransaction(txName, nonce, destination, value, creator, confirmations, '', safe.get('address'), safe.get('confirmations'), '0x')
    expect(createTxFnc).toThrow(/Transaction with same nonce/)
  })

  it('checks the owner who creates the tx has confirmed it', async () => {
    // GIVEN
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const creator = 'foo'
    const confirmations: List<Confirmation> = buildConfirmationsFrom(owners, creator, 'confirmationHash')
    storeTransaction(txName, nonce, destination, value, creator, confirmations, '', safe.get('address'), safe.get('confirmations'), '0x')

    // WHEN
    const transactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    testSizeOfSafesWith(transactions, 1)
  })

  it('checks the owner who creates the tx is an owner', async () => {
    // GIVEN
    const ownerName = 'invented'
    const buildConfirmationsTxFnc = () => buildConfirmationsFrom(owners, ownerName, 'confirmationHash')

    expect(buildConfirmationsTxFnc).toThrow(/The creator of the tx is not an owner/)
  })

  it('checks if safe has one owner transaction has been executed', async () => {
    const ownerName = 'foo'
    const oneOwnerSafe = SafeFactory.oneOwnerSafe(ownerName)
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const tx = ''
    const confirmations: List<Confirmation> = buildExecutedConfirmationFrom(oneOwnerSafe.get('owners'), ownerName)
    const createTxFnc = () => storeTransaction(txName, nonce, destination, value, ownerName, confirmations, tx, oneOwnerSafe.get('address'), oneOwnerSafe.get('confirmations'), '0x')

    expect(createTxFnc).toThrow(/The tx should be mined before storing it in safes with one owner/)
  })

  it('checks if safe has one owner transaction the confirmation list is correctly build', async () => {
    const ownerName = 'foo'
    const oneOwnerSafe = SafeFactory.oneOwnerSafe(ownerName)
    const txName = 'Buy butteries for project'
    const nonce: number = 10
    const tx = 'validTxHash'
    const confirmations: List<Confirmation> = buildExecutedConfirmationFrom(oneOwnerSafe.get('owners'), ownerName)
    storeTransaction(txName, nonce, destination, value, ownerName, confirmations, tx, oneOwnerSafe.get('address'), oneOwnerSafe.get('confirmations'), '0x')

    // WHEN
    const safeTransactions: Map<string, List<Transaction>> = loadSafeTransactions()

    // THEN
    expect(safeTransactions.size).toBe(1)

    const transactions: List<Transaction> | typeof undefined = safeTransactions.get(oneOwnerSafe.address)
    if (!transactions) throw new Error()
    expect(transactions.count()).toBe(1)

    const batteriesTx: Transaction | typeof undefined = transactions.get(0)
    if (!batteriesTx) throw new Error()
    expect(batteriesTx.get('name')).toBe(txName)

    const txConfirmations = batteriesTx.confirmations
    if (!txConfirmations) throw new Error()
    expect(txConfirmations.count()).toBe(1)

    const firstConfirmation: Confirmation | typeof undefined = txConfirmations.get(0)
    if (!firstConfirmation) throw new Error()
    expect(firstConfirmation.get('hash')).toBe(EXECUTED_CONFIRMATION_HASH)
  })
})

