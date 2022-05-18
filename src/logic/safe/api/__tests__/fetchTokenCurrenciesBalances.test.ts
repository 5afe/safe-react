import { fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { _getChainId } from 'src/config'
import { getBalances } from '@gnosis.pm/safe-react-gateway-sdk'

jest.mock('@gnosis.pm/safe-react-gateway-sdk', () => ({
  getBalances: jest.fn(() => Promise.resolve({ success: true })),
}))

describe('fetchTokenCurrenciesBalances', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const excludeSpamTokens = true

  it('Given a safe address, calls the API and returns token balances', () => {
    fetchTokenCurrenciesBalances({
      safeAddress,
      excludeSpamTokens,
      selectedCurrency: 'USD',
    })

    expect(getBalances).toHaveBeenCalledWith(_getChainId(), '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf', 'USD', {
      exclude_spam: true,
      trusted: false,
    })
  })
})
