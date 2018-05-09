// @flow
import { BALANCE_REDUCER_ID } from '~/routes/safe/store/reducer/balances'
import fetchBalance from '~/routes/safe/store/actions/fetchBalance'
import { aNewStore } from '~/store'
import { addEtherTo } from '~/test/addEtherTo'
import { aDeployedSafe } from './builder/deployedSafe.builder'

const balanceReducerTests = () => {
  describe('Safe Actions[fetchBalance]', () => {
    let store
    beforeEach(async () => {
      store = aNewStore()
    })

    it('reducer should return 0 to just deployed safe', async () => {
      // GIVEN
      const address = await aDeployedSafe(store)

      // WHEN
      await store.dispatch(fetchBalance(address))

      // THEN
      const balances = store.getState()[BALANCE_REDUCER_ID]
      expect(balances).not.toBe(undefined)
      expect(balances.get(address)).toBe('0')
    })

    it('reducer should return 1.3456 ETH as funds to safe with 1 ETH', async () => {
      // GIVEN
      const address = await aDeployedSafe(store)

      // WHEN
      await addEtherTo(address, '1.3456')
      await store.dispatch(fetchBalance(address))

      // THEN
      const balances = store.getState()[BALANCE_REDUCER_ID]
      expect(balances).not.toBe(undefined)
      expect(balances.get(address)).toBe('1.3456')
    })
  })
}

export default balanceReducerTests
