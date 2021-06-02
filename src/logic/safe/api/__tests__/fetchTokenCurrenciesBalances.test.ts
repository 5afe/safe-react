import axios from 'axios'

import { getSafeClientGatewayBaseUrl } from 'src/config'
import { fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'

jest.mock('axios')
describe('fetchTokenCurrenciesBalances', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const excludeSpamTokens = true

  afterAll(() => {
    jest.unmock('axios')
  })

  it('Given a safe address, calls the API and returns token balances', async () => {
    // given
    const expectedResult = {
      fiatTotal: '104.32679999999999',
      items: [
        {
          tokenInfo: {
            type: 'ERC20',
            address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
            decimals: 18,
            symbol: 'YFI',
            name: 'yearn.finance',
            logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e.png',
          },
          balance: '465000000000000',
          fiatBalance: '24.0178',
          fiatConversion: '51651.1013',
        },
        {
          tokenInfo: {
            type: 'ETHER',
            address: '0x0000000000000000000000000000000000000000',
            decimals: 18,
            symbol: 'ETH',
            name: 'Ether',
            logoUri: null,
          },
          balance: '4035779634142020',
          fiatBalance: '10.9702',
          fiatConversion: '2718.2447',
        },
      ],
    }

    const apiUrl = getSafeClientGatewayBaseUrl(safeAddress)

    // @ts-expect-error mocking get method
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: expectedResult }))

    // when
    const result = await fetchTokenCurrenciesBalances({
      safeAddress,
      excludeSpamTokens,
      selectedCurrency: 'USD',
    })

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(`${apiUrl}/balances/USD/?trusted=false&exclude_spam=${excludeSpamTokens}`)
  })
})
