// @flow
import { List, Map } from 'immutable'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { type Safe } from '~/routes/safe/store/model/safe'
import { SafeFactory } from '~/routes/safe/store/test/builder/index.builder'
import { safesSelector } from '../selectors'

const providerReducerTests = () => {
  describe('Safes Selector[safesSelector]', () => {
    it('should return empty list when no safes', () => {
      // GIVEN
      const reduxStore = { [SAFE_REDUCER_ID]: Map(), providers: undefined }
      const emptyList = List([])

      // WHEN
      const safes = safesSelector(reduxStore)

      // THEN
      expect(safes).toEqual(emptyList)
    })

    it('should return a list of size 2 when 2 safes are created', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe)
      map = map.set('barAddress', SafeFactory.twoOwnersSafe)

      const reduxStore = { [SAFE_REDUCER_ID]: map, providers: undefined }

      // WHEN
      const safes = safesSelector(reduxStore)

      // THEN
      expect(safes.count()).toEqual(2)
      expect(safes.get(0)).not.toEqual(safes.get(1))
    })
  })
}

export default providerReducerTests
