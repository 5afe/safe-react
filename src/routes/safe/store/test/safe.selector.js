// @flow
import { Map } from 'immutable'
import { type Match } from 'react-router-dom'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { type Safe } from '~/routes/safe/store/model/safe'
import { SafeFactory } from '~/routes/safe/store/test/builder/index.builder'
import { safeSelector } from '../selectors'

const buildMathPropsFrom = (address): Match => ({
  params: {
    address,
  },
  isExact: true,
  path: '',
  url: '',
})

const safeSelectorTests = () => {
  describe('Safe Selector[safeSelector]', () => {
    it('should return empty list when no safes', () => {
      // GIVEN
      const reduxStore = { [SAFE_REDUCER_ID]: Map(), providers: undefined }
      const match: Match = buildMathPropsFrom('fooAddress')

      // WHEN
      const safes = safeSelector(reduxStore, { match })

      // THEN
      expect(safes).toBe(undefined)
    })

    it('should return a list of size 2 when 2 safes are created', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe)
      map = map.set('barAddress', SafeFactory.twoOwnersSafe)

      const match: Match = buildMathPropsFrom('fooAddress')
      const undefMatch: Match = buildMathPropsFrom('inventedAddress')

      const reduxStore = { [SAFE_REDUCER_ID]: map, providers: undefined }

      // WHEN
      const oneOwnerSafe = safeSelector(reduxStore, { match })
      const undefinedSafe = safeSelector(reduxStore, { match: undefMatch })

      // THEN
      expect(oneOwnerSafe).toEqual(SafeFactory.oneOwnerSafe)
      expect(undefinedSafe).toBe(undefined)
    })
  })
}

export default safeSelectorTests
