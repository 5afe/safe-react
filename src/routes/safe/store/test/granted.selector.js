// @flow
import { Map } from 'immutable'
import { type Match } from 'react-router-dom'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { type Safe } from '~/routes/safe/store/model/safe'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
import { buildMathPropsFrom } from '~/test/buildReactRouterProps'
import { getProviderInfo } from '~/wallets/getWeb3'
import { grantedSelector } from '~/routes/safe/container/selector'
import { makeProvider } from '~/wallets/store/model/provider'

const grantedSelectorTests = () => {
  let provider
  beforeEach(async () => {
    provider = await getProviderInfo()
  })

  describe('Safe Selector[grantedSelector]', () => {
    it('should be granted to operate a safe when the user is owner', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe(provider.account))

      const match: Match = buildMathPropsFrom('fooAddress')

      const reduxStore = {
        [SAFE_REDUCER_ID]: map,
        providers: makeProvider(provider),
        balances: undefined,
        transactions: undefined,
      }

      // WHEN
      const granted = grantedSelector(reduxStore, { match })

      // THEN
      expect(granted).toBe(true)
    })

    it('should be granted to operate a safe when the user is owner in case-insensitive', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe(provider.account.toUpperCase()))

      const match: Match = buildMathPropsFrom('fooAddress')

      const reduxStore = {
        [SAFE_REDUCER_ID]: map,
        providers: makeProvider(provider),
        balances: undefined,
        transactions: undefined,
      }

      // WHEN
      const granted = grantedSelector(reduxStore, { match })

      // THEN
      expect(granted).toBe(true)
    })

    it('should NOT be granted to operate with a Safe when the user is NOT owner', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe('inventedOwner'))

      const match: Match = buildMathPropsFrom('fooAddress')

      const reduxStore = {
        [SAFE_REDUCER_ID]: map,
        providers: makeProvider(provider),
        balances: undefined,
        transactions: undefined,
      }

      // WHEN
      const granted = grantedSelector(reduxStore, { match })

      // THEN
      expect(granted).toBe(false)
    })
  })
}

export default grantedSelectorTests
