// @flow
import { Map, List } from 'immutable'
import { type Safe } from '~/routes/safe/store/model/safe'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { loadSafe } from '~/routes/load/container/Load'
import { safesMapSelector } from '~/routes/safeList/store/selectors'
import { makeOwner, type Owner } from '~/routes/safe/store/model/owner'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { safesInitialState } from '~/routes/safe/store/reducer/safe'
import { setOwners, OWNERS_KEY } from '~/utils/storage'

describe('Safe - redux load safe', () => {
  let store
  let address: string
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    address = await aMinedSafe(store)
    localStorage.clear()
    accounts = await getWeb3().eth.getAccounts()
  })

  it('if safe is not present, store and persist it with default names', async () => {
    const safeName = 'Loaded Safe'
    const safeAddress = address
    const updateSafeFn: any = (...args) => store.dispatch(updateSafe(...args))

    await loadSafe(safeName, safeAddress, updateSafeFn)

    const safes: Map<string, Safe> = safesMapSelector(store.getState())
    expect(safes.size).toBe(1)
    if (!safes) throw new Error()
    const safe = safes.get(safeAddress)
    if (!safe) throw new Error()

    expect(safe.get('name')).toBe(safeName)
    expect(safe.get('threshold')).toBe(1)
    expect(safe.get('address')).toBe(safeAddress)
    expect(safe.get('owners')).toEqual(List([makeOwner({ name: 'UNKNOWN', address: accounts[0] })]))

    expect(safesInitialState()).toEqual(safes)
  })

  it('if safe is not present but owners, store and persist it with stored names', async () => {
    const safeName = 'Loaded Safe'
    const safeAddress = address
    const ownerName = 'Foo Bar Restores'
    const updateSafeFn: any = (...args) => store.dispatch(updateSafe(...args))
    const owner: Owner = makeOwner({ name: ownerName, address: accounts[0] })
    setOwners(safeAddress, List([owner]))

    await loadSafe(safeName, safeAddress, updateSafeFn)

    const safes: Map<string, Safe> = safesMapSelector(store.getState())
    expect(safes.size).toBe(1)
    if (!safes) throw new Error()
    const safe = safes.get(safeAddress)
    if (!safe) throw new Error()

    expect(safe.get('name')).toBe(safeName)
    expect(safe.get('threshold')).toBe(1)
    expect(safe.get('address')).toBe(safeAddress)
    expect(safe.get('owners')).toEqual(List([makeOwner({ name: ownerName, address: accounts[0] })]))

    expect(safesInitialState()).toEqual(safes)
  })

  it('if safe is present but no owners, store and persist it with default names', async () => {
    const safeAddress = await aMinedSafe(store)
    localStorage.removeItem(`${OWNERS_KEY}-${safeAddress}`)

    const safeName = 'Loaded Safe'
    const updateSafeFn: any = (...args) => store.dispatch(updateSafe(...args))
    await loadSafe(safeName, safeAddress, updateSafeFn)

    const safes: Map<string, Safe> = safesMapSelector(store.getState())
    expect(safes.size).toBe(2)
    if (!safes) throw new Error()
    const safe = safes.get(safeAddress)
    if (!safe) throw new Error()

    expect(safe.get('name')).toBe(safeName)
    expect(safe.get('threshold')).toBe(1)
    expect(safe.get('address')).toBe(safeAddress)
    expect(safe.get('owners')).toEqual(List([makeOwner({ name: 'UNKNOWN', address: accounts[0] })]))

    expect(safesInitialState()).toEqual(safes)
  })

  it('if safe is present but owners, store and persist it with stored names', async () => {
    const safeAddress = await aMinedSafe(store)

    const safeName = 'Loaded Safe'
    const updateSafeFn: any = (...args) => store.dispatch(updateSafe(...args))
    await loadSafe(safeName, safeAddress, updateSafeFn)

    const safes: Map<string, Safe> = safesMapSelector(store.getState())
    expect(safes.size).toBe(2)
    if (!safes) throw new Error()
    const safe = safes.get(safeAddress)
    if (!safe) throw new Error()

    expect(safe.get('name')).toBe(safeName)
    expect(safe.get('threshold')).toBe(1)
    expect(safe.get('address')).toBe(safeAddress)
    expect(safe.get('owners')).toEqual(List([makeOwner({ name: 'Adol 1 Eth Account', address: accounts[0] })]))

    expect(safesInitialState()).toEqual(safes)
  })
})
