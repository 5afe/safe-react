// @flow
/*
import addBalances from '~/routes/safe/store/actions/addBalances'
import { aNewStore } from '~/store'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { balanceSelector } from '../selectors'

const balanceSelectorTests = () => {
  describe('Safe Selector[balanceSelector]', () => {
    it('should return 0 when safe address is not found', () => {
      // GIVEN
      const safeAddress = 'foo'
      const match = buildMathPropsFrom(safeAddress)
      const store = aNewStore()

      // WHEN
      const balance = balanceSelector(store.getState(), { match })

      // THEN
      expect(balance).toBe('0')
    })

    it('should return 0 when safe has no funds', async () => {
      // GIVEN
      const safeAddress = 'foo'
      const match = buildMathPropsFrom(safeAddress)
      const store = aNewStore()

      // WHEN
      await store.dispatch(addBalances('bar', '1'))
      const balance = balanceSelector(store.getState(), { match })

      // THEN
      expect(balance).toBe('0')
    })

    it('should return safe funds', async () => {
      // GIVEN
      const safeAddress = 'foo'
      const match = buildMathPropsFrom(safeAddress)
      const store = aNewStore()

      // WHEN
      await store.dispatch(addBalances(safeAddress, '1.3456'))
      const balance = balanceSelector(store.getState(), { match })

      // THEN
      expect(balance).toBe('1.3456')
    })
  })
}

export default balanceSelectorTests
*/
