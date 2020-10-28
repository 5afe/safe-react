import axios from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { fetchTokenCurrenciesBalances } from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import { aNewStore } from 'src/store'

jest.mock('axios')
describe('fetchTokenCurrenciesBalances', () => {
  let store
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const excludeSpamTokens = true
  beforeEach(() => {
    store = aNewStore()
  })
  afterAll(() => {
    jest.unmock('axios')
  })

  it('Given a safe address, calls the API and returns token balances', async () => {
    // given
    const expectedResult = [
      {
        tokenAddress: null,
        token: null,
        balance: '849890000000000000',
        fiatBalance: '337.2449',
        fiatConversion: '396.81',
        fiatCode: 'USD',
      },
      {
        tokenAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        token: {
          name: 'Dai',
          symbol: 'DAI',
          decimals: 18,
          logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa.png',
        },
        balance: '24698677800000000000',
        fiatBalance: '29.3432',
        fiatConversion: '1.188',
        fiatCode: 'USD',
      },
    ]
    const apiUrl = getSafeServiceBaseUrl(safeAddress)

    // @ts-ignore
    axios.get.mockImplementationOnce(() => Promise.resolve(expectedResult))

    // when
    const result = await fetchTokenCurrenciesBalances(safeAddress, excludeSpamTokens)

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(`${apiUrl}/balances/usd/?exclude_spam=${excludeSpamTokens}`)
  })
})
