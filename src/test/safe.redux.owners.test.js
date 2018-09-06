// @flow
import { aNewStore } from '~/store'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import { confirmationsTransactionSelector, safeTransactionsSelector } from '~/routes/safe/store/selectors'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { type Safe } from '~/routes/safe/store/model/safe'
import { getGnosisSafeInstanceAt } from '~/logic/contracts/safeContracts'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { NAME_PARAM, OWNER_ADDRESS_PARAM, INCREASE_PARAM } from '~/routes/safe/component/AddOwner/AddOwnerForm'
import { addOwner } from '~/routes/safe/component/AddOwner/index'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import { removeOwner, shouldDecrease, initialValuesFrom } from '~/routes/safe/component/RemoveOwner'
import { DECREASE_PARAM } from '~/routes/safe/component/RemoveOwner/RemoveOwnerForm'
import { getSafeFrom } from '~/test/utils/safeHelper'
import { processTransaction } from '~/logic/safe/safeFrontendOperations'
import { allowedRemoveSenderInTxHistoryService } from '~/config'

describe('React DOM TESTS > Add and remove owners', () => {
  const processOwnerModification = async (store, safeAddress, executor, threshold) => {
    const reduxTransactions = safeTransactionsSelector(store.getState(), { safeAddress })
    const tx = reduxTransactions.get(0)
    if (!tx) throw new Error()

    const confirmed = confirmationsTransactionSelector(store.getState(), { transaction: tx })
    const data = tx.get('data')
    expect(data).not.toBe(null)
    expect(data).not.toBe(undefined)
    expect(data).not.toBe('')

    return processTransaction(safeAddress, tx, confirmed, executor, threshold)
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

  const getAddressesFrom = (safe: Safe) => safe.get('owners').map(owner => owner.get('address'))

  it('adds owner without increasing the threshold', async () => {
    // GIVEN
    const numOwners = 2
    const threshold = 1
    const store = aNewStore()
    const address = await aMinedSafe(store, numOwners, threshold, 10)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    const values = {
      [NAME_PARAM]: 'Adol 3 Metamask',
      [OWNER_ADDRESS_PARAM]: accounts[2],
      [INCREASE_PARAM]: false,
    }

    // WHEN
    let safe = getSafeFrom(store.getState(), address)
    await addOwner(values, safe, threshold, accounts[0])

    // THEN
    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[2], accounts[0], accounts[1])

    await store.dispatch(fetchSafe(safe))
    safe = getSafeFrom(store.getState(), address)
    expect(safe.get('owners').count()).toBe(3)
    await assureOwnersAre(gnosisSafe, ...getAddressesFrom(safe))
  })

  it('adds owner increasing the threshold', async () => {
    // GIVEN
    const numOwners = 2
    const threshold = 1
    const store = aNewStore()
    const address = await aMinedSafe(store, numOwners, threshold, 10)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    const values = {
      [NAME_PARAM]: 'Adol 3 Metamask',
      [OWNER_ADDRESS_PARAM]: accounts[2],
      [INCREASE_PARAM]: true,
    }

    // WHEN
    let safe = getSafeFrom(store.getState(), address)
    await addOwner(values, safe, threshold, accounts[0])

    // THEN
    await assureThresholdIs(gnosisSafe, 2)
    await assureOwnersAre(gnosisSafe, accounts[2], accounts[0], accounts[1])

    await store.dispatch(fetchSafe(safe))
    safe = getSafeFrom(store.getState(), address)
    expect(safe.get('owners').count()).toBe(3)
    await assureOwnersAre(gnosisSafe, ...getAddressesFrom(safe))
  })

  it('remove owner decreasing owner automatically', async () => {
    if (!allowedRemoveSenderInTxHistoryService()) {
      return
    }

    const numOwners = 2
    const threshold = 2
    const store = aNewStore()
    const address = await aMinedSafe(store, numOwners, threshold, 10)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    const decrease = shouldDecrease(numOwners, threshold)
    const values = initialValuesFrom(decrease)
    expect(values[DECREASE_PARAM]).toBe(true)

    let safe = getSafeFrom(store.getState(), address)
    await removeOwner(values, safe, threshold, accounts[1], 'Adol Metamask 2', accounts[0])
    await store.dispatch(fetchTransactions(address))
    await processOwnerModification(store, address, accounts[1], 2)

    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[0])

    await store.dispatch(fetchSafe(safe))
    safe = getSafeFrom(store.getState(), address)
    expect(safe.get('owners').count()).toBe(1)
    await assureOwnersAre(gnosisSafe, ...getAddressesFrom(safe))
  })

  it('remove owner decreasing threshold', async () => {
    const numOwners = 3
    const threshold = 2
    const store = aNewStore()
    const address = await aMinedSafe(store, numOwners, threshold, 10)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    const decrease = true
    const values = initialValuesFrom(decrease)

    let safe = getSafeFrom(store.getState(), address)
    await removeOwner(values, safe, threshold, accounts[2], 'Adol Metamask 3', accounts[0])
    await store.dispatch(fetchTransactions(address))
    await processOwnerModification(store, address, accounts[1], 2)

    await assureThresholdIs(gnosisSafe, 1)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])

    await store.dispatch(fetchSafe(safe))
    safe = getSafeFrom(store.getState(), address)
    expect(safe.get('owners').count()).toBe(2)
    await assureOwnersAre(gnosisSafe, ...getAddressesFrom(safe))
  })

  it('remove owner without decreasing threshold', async () => {
    const numOwners = 3
    const threshold = 2
    const store = aNewStore()
    const address = await aMinedSafe(store, numOwners, threshold, 10)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const gnosisSafe = await getGnosisSafeInstanceAt(address)

    const decrease = shouldDecrease(numOwners, threshold)
    const values = initialValuesFrom(decrease)
    expect(values[DECREASE_PARAM]).toBe(false)

    let safe = getSafeFrom(store.getState(), address)
    await removeOwner(values, safe, threshold, accounts[2], 'Adol Metamask 3', accounts[0])
    await store.dispatch(fetchTransactions(address))
    await processOwnerModification(store, address, accounts[1], 2)

    await assureThresholdIs(gnosisSafe, 2)
    await assureOwnersAre(gnosisSafe, accounts[0], accounts[1])

    await store.dispatch(fetchSafe(safe))
    safe = getSafeFrom(store.getState(), address)
    expect(safe.get('owners').count()).toBe(2)
    await assureOwnersAre(gnosisSafe, ...getAddressesFrom(safe))
  })
})
