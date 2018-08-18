// @flow
/*
import { aNewStore } from '~/store'
import { aDeployedSafe } from '~/routes/safe/store/test/builder/deployedSafe.builder'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { sleep } from '~/utils/timer'
import { type Match } from 'react-router-dom'
import { promisify } from '~/utils/promisify'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import {
  confirmationsTransactionSelector,
  safeSelector,
  safeTransactionsSelector
} from '~/routes/safe/store/selectors'
import { getTransactionFromReduxStore } from '~/routes/safe/test/testMultisig'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { createTransaction } from '~/wallets/createTransactions'
import { getGnosisSafeContract } from '~/wallets/safeContracts'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
*/
describe('React DOM TESTS > Change threshold', () => {
  it('should update the threshold directly if safe has 1 threshold', async () => {

  })
})

/*
    // GIVEN
    const numOwners = 2
    const threshold = 1
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const match: Match = buildMathPropsFrom(address)
    const safe = safeSelector(store.getState(), { match })
    if (!safe) throw new Error()
    const web3 = getWeb3()
    const GnosisSafe = await getGnosisSafeContract(web3)
    const gnosisSafe = GnosisSafe.at(address)

    // WHEN
    const nonce = Date.now()
    const data = gnosisSafe.contract.changeThreshold.getData(2)
    await createTransaction(safe, "Change Safe's threshold", address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await store.dispatch(fetchTransactions())

    // THEN
    const transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    expect(transactions.count()).toBe(1)

    const thresholdTx = transactions.get(0)
    if (!thresholdTx) throw new Error()
    expect(thresholdTx.get('tx')).not.toBe(null)
    expect(thresholdTx.get('tx')).not.toBe(undefined)
    expect(thresholdTx.get('tx')).not.toBe('')

    const safeThreshold = await gnosisSafe.getThreshold()
    expect(Number(safeThreshold)).toEqual(2)
  })

  const changeThreshold = async (store, safeAddress, executor) => {
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

  it('should wait for confirmation to update threshold when safe has 1+ threshold', async () => {
    // GIVEN
    const numOwners = 3
    const threshold = 2
    const store = aNewStore()
    const address = await aDeployedSafe(store, 10, threshold, numOwners)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const match: Match = buildMathPropsFrom(address)
    const safe = safeSelector(store.getState(), { match })
    if (!safe) throw new Error()
    const web3 = getWeb3()
    const GnosisSafe = await getGnosisSafeContract(web3)
    const gnosisSafe = GnosisSafe.at(address)

    // WHEN
    const nonce = Date.now()
    const data = gnosisSafe.contract.changeThreshold.getData(3)
    await createTransaction(safe, "Change Safe's threshold", address, 0, nonce, accounts[0], data)
    await sleep(1500)
    await store.dispatch(fetchTransactions())

    let transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    if (!transactions) throw new Error()
    expect(transactions.count()).toBe(1)

    let thresholdTx = transactions.get(0)
    if (!thresholdTx) throw new Error()
    expect(thresholdTx.get('tx')).toBe('')
    let firstOwnerConfirmation = thresholdTx.get('confirmations').get(0)
    if (!firstOwnerConfirmation) throw new Error()
    expect(firstOwnerConfirmation.get('status')).toBe(true)
    let secondOwnerConfirmation = thresholdTx.get('confirmations').get(1)
    if (!secondOwnerConfirmation) throw new Error()
    expect(secondOwnerConfirmation.get('status')).toBe(false)

    let safeThreshold = await gnosisSafe.getThreshold()
    expect(Number(safeThreshold)).toEqual(2)

    // THEN
    await changeThreshold(store, address, accounts[1])
    safeThreshold = await gnosisSafe.getThreshold()
    expect(Number(safeThreshold)).toEqual(3)

    await store.dispatch(fetchTransactions())
    sleep(1200)
    transactions = safeTransactionsSelector(store.getState(), { safeAddress: address })
    expect(transactions.count()).toBe(1)

    thresholdTx = transactions.get(0)
    if (!thresholdTx) throw new Error()
    expect(thresholdTx.get('tx')).not.toBe(undefined)
    expect(thresholdTx.get('tx')).not.toBe(null)
    expect(thresholdTx.get('tx')).not.toBe('')

    firstOwnerConfirmation = thresholdTx.get('confirmations').get(0)
    if (!firstOwnerConfirmation) throw new Error()
    expect(firstOwnerConfirmation.get('status')).toBe(true)
    secondOwnerConfirmation = thresholdTx.get('confirmations').get(1)
    if (!secondOwnerConfirmation) throw new Error()
    expect(secondOwnerConfirmation.get('status')).toBe(true)
  })
})
*/
