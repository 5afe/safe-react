// 
import { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import { userAccountSelector } from '../selectors'
import { ProviderFactory } from './builder/index.builder'

const providerReducerTests = () => {
  describe('Provider Name Selector[userAccountSelector]', () => {
    it('should return empty when no provider is loaded', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.noProvider }

      // WHEN
      const providerName = userAccountSelector(reduxStore)

      // THEN
      expect(providerName).toEqual('')
    })

    it('should return empty when Metamask is loaded but not available', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.metamaskLoaded }

      // WHEN
      const providerName = userAccountSelector(reduxStore)

      // THEN
      expect(providerName).toEqual('')
    })

    it('should return account when Metamask is loaded and available', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.metamaskAvailable }

      // WHEN
      const providerName = userAccountSelector(reduxStore)

      // THEN
      expect(providerName).toEqual('0xAdbfgh')
    })
  })
}

export default providerReducerTests
