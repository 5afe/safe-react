// @flow
import { List, Map } from 'immutable'
import { SAFE_REDUCER_ID } from '~/routes/safe/store/reducer/safe'
import { type Safe } from '~/routes/safe/store/model/safe'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
import { PROVIDER_REDUCER_ID } from '~/logic/wallets/store/reducer/provider'
import { makeProvider, type Provider } from '~/logic/wallets/store/model/provider'
import { safesByOwnerSelector } from '../selectors'

const safesListSelectorTests = () => {
  let walletRecord: Provider
  beforeEach(async () => {
    const provider = await getProviderInfo()
    walletRecord = makeProvider(provider)
  })

  describe('Safes Selector[safesByOwnerSelector]', () => {
    it('should return empty list when no safes', () => {
      // GIVEN
      const reduxStore = {
        [PROVIDER_REDUCER_ID]: walletRecord,
        [SAFE_REDUCER_ID]: Map(),
        tokens: undefined,
        transactions: undefined,
      }
      const emptyList = List([])

      // WHEN
      const safes = safesByOwnerSelector(reduxStore, {})

      // THEN
      expect(safes).toEqual(emptyList)
    })

    it('should return a list of size 0 when 0 of 2 safes contains the user as owner', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe('foo'))
      map = map.set('barAddress', SafeFactory.twoOwnersSafe('foo', 'bar'))

      const reduxStore = {
        [PROVIDER_REDUCER_ID]: walletRecord,
        [SAFE_REDUCER_ID]: map,
        tokens: undefined,
        transactions: undefined,
      }

      // WHEN
      const safes = safesByOwnerSelector(reduxStore, {})

      // THEN
      expect(safes.count()).toEqual(0)
    })

    it('should return a list of size 1 when 1 of 2 safes contains the user as owner', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe(walletRecord.account))
      map = map.set('barAddress', SafeFactory.twoOwnersSafe('foo', 'bar'))

      const reduxStore = {
        [PROVIDER_REDUCER_ID]: walletRecord,
        [SAFE_REDUCER_ID]: map,
        tokens: undefined,
        transactions: undefined,
      }

      // WHEN
      const safes = safesByOwnerSelector(reduxStore, {})

      // THEN
      expect(safes.count()).toEqual(1)
    })

    it('should return a list of size 2 when 2 of 2 safes contains the user as owner', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      const userAccount = walletRecord.account
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe(userAccount))
      map = map.set('barAddress', SafeFactory.twoOwnersSafe('foo', userAccount))

      const reduxStore = {
        [SAFE_REDUCER_ID]: map,
        [PROVIDER_REDUCER_ID]: walletRecord,
        tokens: undefined,
        transactions: undefined,
      }

      // WHEN
      const safes = safesByOwnerSelector(reduxStore, {})

      // THEN
      expect(safes.count()).toEqual(2)
      expect(safes.get(0)).not.toEqual(safes.get(1))
    })

    it('should return safes under owners case-insensitive', () => {
      // GIVEN
      let map: Map<string, Safe> = Map()
      const userAccountUpper = walletRecord.account.toUpperCase()
      map = map.set('fooAddress', SafeFactory.oneOwnerSafe(userAccountUpper))
      map = map.set('barAddress', SafeFactory.twoOwnersSafe('foo', userAccountUpper))

      const reduxStore = {
        [SAFE_REDUCER_ID]: map,
        [PROVIDER_REDUCER_ID]: walletRecord,
        tokens: undefined,
        transactions: undefined,
      }

      // WHEN
      const safes = safesByOwnerSelector(reduxStore, {})

      // THEN
      expect(safes.count()).toEqual(2)
      expect(safes.get(0)).not.toEqual(safes.get(1))
    })
  })
}

export default safesListSelectorTests
