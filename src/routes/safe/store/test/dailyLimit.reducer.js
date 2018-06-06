// @flow
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import fetchDailyLimit from '~/routes/safe/store/actions/fetchDailyLimit'
import { aNewStore } from '~/store'
import { addEtherTo } from '~/test/addEtherTo'
import { aDeployedSafe, executeWithdrawnOn } from './builder/deployedSafe.builder'

const updateDailyLimitReducerTests = () => {
  describe('Safe Actions[updateDailyLimit]', () => {
    let store
    beforeEach(async () => {
      store = aNewStore()
    })

    it('reducer should return 0 as spentToday value from just deployed safe', async () => {
      // GIVEN
      const dailyLimitValue = 0.5
      const safeAddress = await aDeployedSafe(store, 0.5)
      // WHEN
      await store.dispatch(fetchDailyLimit(safeAddress))

      // THEN
      const safes = store.getState()[SAFE_REDUCER_ID]
      const dailyLimit = safes.get(safeAddress).get('dailyLimit')
      expect(dailyLimit).not.toBe(undefined)
      expect(dailyLimit.value).toBe(dailyLimitValue)
      expect(dailyLimit.spentToday).toBe(0)
    })

    it('reducer should return 0.1456 ETH as spentToday if the user has withdrawn 0.1456 from MAX of 0.3 ETH', async () => {
      // GIVEN
      const dailyLimitValue = 0.3
      const safeAddress = await aDeployedSafe(store, dailyLimitValue)
      await addEtherTo(safeAddress, '0.5')
      const value = 0.1456

      // WHEN
      await executeWithdrawnOn(safeAddress, value)
      await store.dispatch(fetchDailyLimit(safeAddress))

      // THEN
      const safes = store.getState()[SAFE_REDUCER_ID]
      const dailyLimit = safes.get(safeAddress).get('dailyLimit')
      expect(dailyLimit).not.toBe(undefined)
      expect(dailyLimit.value).toBe(dailyLimitValue)
      expect(dailyLimit.spentToday).toBe(value)
    })
  })
}

export default updateDailyLimitReducerTests
