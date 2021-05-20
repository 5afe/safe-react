import axios from 'axios'

import { getSafeServiceBaseUrl } from 'src/config'
import { fetchTokenBalances, ServiceTokenBalances } from 'src/logic/safe/api/fetchTokenBalances'

jest.mock('axios')
describe('fetchTokenBalances', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const excludeSpam = true

  afterAll(() => {
    jest.unmock('axios')
  })

  it('Given a safe address, calls the API and returns token balances', async () => {
    // given
    const expectedResult: ServiceTokenBalances = [
      {
        tokenAddress: null,
        token: null,
        balance: '24698677800000000000',
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
      },
    ]

    const apiUrl = getSafeServiceBaseUrl(safeAddress)

    // @ts-ignore
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: expectedResult }))

    // when
    const result = await fetchTokenBalances({
      safeAddress,
      excludeSpam,
    })

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(axios.get).toHaveBeenCalled()
    expect(axios.get).toBeCalledWith(`${apiUrl}/balances?trusted=false&exclude_spam=${excludeSpam}`)
  })
})
