import { TransactionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { isSupportedMultiSendCall } from 'src/logic/safe/transactions/multisend'

const MULTISEND_ADDRESS = '0x40a2accbd92bca938b02010e17a5b8929b49130d'
jest.mock('src/logic/contracts/safeContracts', () => ({
  ...jest.requireActual('src/logic/contracts/safeContracts'),
  getMultiSendCallOnlyContractAddress: () => MULTISEND_ADDRESS,
  getMultiSendContractAddress: () => MULTISEND_ADDRESS,
}))

describe('isSupportedMultiSendCall', () => {
  it('should return true if multiSend call is made to supported Multisend contract', () => {
    const data = {
      type: 'Custom',
      methodName: 'multiSend',
      to: {
        value: '0x40a2accbd92bca938b02010e17a5b8929b49130d',
      },
    } as TransactionInfo

    expect(isSupportedMultiSendCall(data)).toBe(true)
  })

  it('should fail if Multisend contract is not the supported one', () => {
    const data = {
      type: 'Custom',
      methodName: 'multiSend',
      to: {
        value: '0x0000000000000000000000000000000000000000',
      },
    } as TransactionInfo

    expect(isSupportedMultiSendCall(data)).toBe(false)
  })

  it('should fail if txInfo methodName is not "multiSend"', () => {
    const data = {
      type: 'Custom',
      methodName: 'foobar',
      to: {
        value: '0x40a2accbd92bca938b02010e17a5b8929b49130d',
      },
    } as TransactionInfo

    expect(isSupportedMultiSendCall(data)).toBe(false)
  })
})
