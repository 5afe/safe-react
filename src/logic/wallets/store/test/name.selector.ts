// 
import { PROVIDER_REDUCER_ID } from 'src/logic/wallets/store/reducer/provider'
import { providerNameSelector } from '../selectors'
import { ProviderFactory } from './builder/index.builder'

const providerReducerTests = () => {
  describe('Provider Name Selector[providerNameSelector]', () => {
    it('should return undefined when no provider is loaded', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.noProvider }

      // WHEN
      const providerName = providerNameSelector(reduxStore)

      // THEN
      expect(providerName).toEqual(undefined)
    })

    it('should return metamask when Metamask is loaded but not available', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.metamaskLoaded }

      // WHEN
      const providerName = providerNameSelector(reduxStore)

      // THEN
      expect(providerName).toEqual('metamask')
    })

    it('should return METAMASK when Metamask is loaded and available', () => {
      // GIVEN
      const reduxStore = { [PROVIDER_REDUCER_ID]: ProviderFactory.metamaskAvailable }

      // WHEN
      const providerName = providerNameSelector(reduxStore)

      // THEN
      expect(providerName).toEqual('metamask')
    })
  })
}

export default providerReducerTests
