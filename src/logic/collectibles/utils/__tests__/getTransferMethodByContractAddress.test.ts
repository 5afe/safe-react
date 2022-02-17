import { getTransferMethodByContractAddress } from 'src/logic/collectibles/utils'

jest.mock('src/config', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('src/config')

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getNetworkId: jest.fn().mockReturnValue(4),
  }
})

describe('getTransferMethodByContractAddress', () => {
  const config = require('src/config')

  afterAll(() => {
    jest.unmock('src/config')
  })

  it(`should return "0x42842e0e" method, if non-CK address is provided`, () => {
    // Given
    config.getNetworkId.mockReturnValue(4)

    // When
    const selectedMethod = getTransferMethodByContractAddress()

    // Then
    expect(selectedMethod).toBe('0x42842e0e')
  })
})
