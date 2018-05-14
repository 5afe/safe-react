// @flow
import { aNewStore } from '~/store'
import { addEtherTo } from '~/test/addEtherTo'
import { aDeployedSafe, executeWithdrawnOn } from '~/routes/safe/store/test/builder/deployedSafe.builder'

describe('Safe Blockchain Test', () => {
  let store
  beforeEach(async () => {
    store = aNewStore()
  })

  it('wihdrawn should return revert error if exceeded dailyLimit', async () => {
    // GIVEN
    const dailyLimitValue = 0.30
    const safeAddress = await aDeployedSafe(store, dailyLimitValue)
    await addEtherTo(safeAddress, '0.7')
    const value = 0.15

    // WHEN
    await executeWithdrawnOn(safeAddress, value)
    await executeWithdrawnOn(safeAddress, value)

    // THEN
    expect(executeWithdrawnOn(safeAddress, value)).rejects.toThrow('VM Exception while processing transaction: revert')
  })
})
