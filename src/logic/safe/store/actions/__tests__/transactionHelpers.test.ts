import { getMockedSafeInstance } from 'src/test/utils/safeHelper'

import { getCurrentSafeVersion } from 'src/logic/safe/utils/safeVersion'
import { generateSafeTxHash } from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'

const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'

jest.mock('src/logic/wallets/getWeb3', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('src/logic/wallets/getWeb3')

  return {
    __esModule: true, // Use it when dealing with esModules
    ...originalModule,
    getChainIdFrom: jest.fn(),
  }
})

describe('generateSafeTxHash', () => {
  const getWeb3 = require('src/logic/wallets/getWeb3')

  it('It should return a safe transaction hash for a v1.0.0 safe', async () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const userAddress3 = 'address3'
    const safeInstance = getMockedSafeInstance({})
    const safeVersion = await getCurrentSafeVersion(safeInstance)
    const txArgs = {
      baseGas: '100',
      data: '',
      gasPrice: '1000',
      gasToken: '',
      nonce: 0,
      operation: 0,
      refundReceiver: userAddress,
      safeInstance,
      safeTxGas: '1000',
      sender: userAddress2,
      sigs: '',
      to: userAddress3,
      valueInWei: '5000',
    }

    // when
    const result = await generateSafeTxHash(safeAddress, safeVersion, txArgs)

    // then
    expect(result).toBe('0x21e6ebc992f959dd0a2a6ce6034c414043c598b7f446c274efb3527c30dec254')
  })

  it('It should return a safe transaction hash for a v1.3.0 safe', async () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const userAddress3 = 'address3'
    const safeInstance = getMockedSafeInstance({ version: '1.3.0' })
    const safeVersion = await getCurrentSafeVersion(safeInstance)
    getWeb3.getChainIdFrom.mockReturnValue(4)
    const txArgs = {
      baseGas: '100',
      data: '',
      gasPrice: '1000',
      gasToken: '',
      nonce: 0,
      operation: 0,
      refundReceiver: userAddress,
      safeInstance,
      safeTxGas: '1000',
      sender: userAddress2,
      sigs: '',
      to: userAddress3,
      valueInWei: '5000',
    }

    // when
    const result = await generateSafeTxHash(safeAddress, safeVersion, txArgs)

    // then
    expect(result).toBe('0xe40c2239ab4eb98cde6496f49dd3692bf54dbae8ce6969b19244d37f8d032b9a')
  })
})
