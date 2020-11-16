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

  it(`should return "transfer" method, if CK address is provided for MAINNET`, () => {
    // Given
    config.getNetworkId.mockReturnValue(1)
    const contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d'

    // When
    const selectedMethod = getTransferMethodByContractAddress(contractAddress)

    // Then
    expect(selectedMethod).toBe('transfer')
  })

  it(`should return "transfer" method, if CK address is provided for RINKEBY`, () => {
    // Given
    config.getNetworkId.mockReturnValue(4)
    const contractAddress = '0x16baf0de678e52367adc69fd067e5edd1d33e3bf'

    // When
    const selectedMethod = getTransferMethodByContractAddress(contractAddress)

    // Then
    expect(selectedMethod).toBe('transfer')
  })

  it(`should return "0x42842e0e" method, if CK address is provided any other network`, () => {
    // Given
    config.getNetworkId.mockReturnValue(100)
    const contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d'

    // When
    const selectedMethod = getTransferMethodByContractAddress(contractAddress)

    // Then
    expect(selectedMethod).toBe('0x42842e0e')
  })

  it(`should return "0x42842e0e" method, if non-CK address is provided`, () => {
    // Given
    config.getNetworkId.mockReturnValue(4)
    const contractAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'

    // When
    const selectedMethod = getTransferMethodByContractAddress(contractAddress)

    // Then
    expect(selectedMethod).toBe('0x42842e0e')
  })
})
