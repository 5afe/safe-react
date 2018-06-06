// @flow
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { aNewStore } from '~/store'
import updateThreshold from '~/routes/safe/store/actions/updateThreshold'
import { aDeployedSafe } from './builder/deployedSafe.builder'

const thresholdReducerTests = () => {
  describe('Safe Actions[updateThreshold]', () => {
    let store
    beforeEach(async () => {
      store = aNewStore()
    })

    it('reducer should return 3 when a safe of 3 threshold has just been created', async () => {
      // GIVEN
      const safeThreshold = 3
      const numOwners = 3

      // WHEN
      const safeAddress = await aDeployedSafe(store, 0.5, safeThreshold, numOwners)

      // THEN
      const safes = store.getState()[SAFE_REDUCER_ID]
      const threshold = safes.get(safeAddress).get('confirmations')
      expect(threshold).not.toBe(undefined)
      expect(threshold).toBe(safeThreshold)
    })

    it('reducer should change correctly', async () => {
      // GIVEN
      const safeThreshold = 3
      const numOwners = 3
      const safeAddress = await aDeployedSafe(store, 0.5, safeThreshold, numOwners)

      // WHEN
      const newThreshold = 1
      await store.dispatch(updateThreshold(safeAddress, newThreshold))

      // THEN
      const safes = store.getState()[SAFE_REDUCER_ID]
      const threshold = safes.get(safeAddress).get('confirmations')
      expect(threshold).not.toBe(undefined)
      expect(threshold).toBe(newThreshold)
    })
  })
}

export default thresholdReducerTests
