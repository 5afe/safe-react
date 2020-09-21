import { aNewStore } from 'src/store'
import fetchTokenCurrenciesBalances from 'src/logic/currencyValues/api/fetchTokenCurrenciesBalances'
import axios from 'axios'
import { getTxServiceHost } from 'src/config'

jest.mock('axios')
describe('fetchTokenCurrenciesBalances', () => {
  let store
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  beforeEach(async () => {
    store = aNewStore()
  })
  afterAll(() => {
    jest.unmock('axios')
  })

  it('Given a safe address, calls the API and returns token balances', async () => {
    // given
    const expectedResult = [
      {
        balance: '849890000000000000',
        balanceUsd: '337.2449',
        token: null,
        tokenAddress: null,
        usdConversion: '396.81',
      },
      {
        balance: '24698677800000000000',
        balanceUsd: '29.3432',
        token: {
          name: 'Dai',
          symbol: 'DAI',
          decimals: 18,
          logoUri: 'https://gnosis-safe-token-logos.s3.amazonaws.com/0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa.png',
        },
        tokenAddress: '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa',
        usdConversion: '1.188',
      },
    ]
    const apiUrl = getTxServiceHost()

    // @ts-ignore
    axios.get.mockImplementationOnce(() => Promise.resolve(expectedResult))

    // when
    const result = await fetchTokenCurrenciesBalances(safeAddress)

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(`${apiUrl}safes/${safeAddress}/balances/usd/`, { params: { limit: 3000 } })
  })
})
