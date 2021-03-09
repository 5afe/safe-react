import { getMockedSafeInstance, getMockedTxServiceModel } from 'src/test/utils/safeHelper'

import {
  generateSafeTxHash,
  getRefundParams,
  isMultiSendTransaction,
  isUpgradeTransaction,
} from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getERC20DecimalsAndSymbol } from 'src/logic/tokens/utils/tokenHelpers'

const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
describe('isMultiSendTransaction', () => {
  it('It should return true if given a transaction without value, the data has multisend data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: '0x8d80ff0a' })

    // when
    const result = isMultiSendTransaction(transaction)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if given a transaction without data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })

    // when
    const result = isMultiSendTransaction(transaction)

    // then
    expect(result).toBe(false)
  })
  it('It should return true if given a transaction without value, the data has not multisend substring', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: 'thisiswrongdata' })

    // when
    const result = isMultiSendTransaction(transaction)

    // then
    expect(result).toBe(false)
  })
})

describe('isUpgradeTransaction', () => {
  it('If should return true if the transaction data is empty', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })

    // when
    const result = isUpgradeTransaction(transaction)

    // then
    expect(result).toBe(false)
  })
  it('It should return false if the transaction data is multisend transaction but does not have upgradeTx function signature encoded in data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: '0x8d80ff0a' })

    // when
    const result = isUpgradeTransaction(transaction)

    // then
    expect(result).toBe(false)
  })
  it('It should return true if the transaction data is multisend transaction and has upgradeTx enconded in function signature data', () => {
    // given
    const upgradeTxData = `0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f200dfa693da0d16f5e7e78fdcbede8fc6ebea44f1cf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247de7edef000000000000000000000000d5d82b6addc9027b22dca772aa68d5d74cdbdf4400dfa693da0d16f5e7e78fdcbede8fc6ebea44f1cf00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f08a032300000000000000000000000034cfac646f301356faa8b21e94227e3583fe3f5f0000000000000000000000000000`
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: upgradeTxData })

    // when
    const result = isUpgradeTransaction(transaction)

    // then
    expect(result).toBe(true)
  })
})

describe('getRefundParams', () => {
  it('It should return null if given a transaction with the gasPrice == 0', async () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', gasPrice: '0' })

    // when
    const result = await getRefundParams(transaction, getERC20DecimalsAndSymbol)

    // then
    expect(result).toBe(null)
  })
  it('It should return 0.000000000000020000 if given a transaction with the gasPrice = 100, the baseGas = 100, the txGas = 100 and 18 decimals', async () => {
    // given
    const gasPrice = '100'
    const baseGas = 100
    const safeTxGas = 100
    const decimals = 18
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', gasPrice, baseGas, safeTxGas })
    const feeString = (Number(gasPrice) * (Number(baseGas) + Number(safeTxGas))).toString().padStart(decimals, '0')
    const whole = feeString.slice(0, feeString.length - decimals) || '0'
    const fraction = feeString.slice(feeString.length - decimals)

    const expectedResult = {
      fee: `${whole}.${fraction}`,
      symbol: 'ETH',
    }

    const getTokenInfoMock = jest.fn().mockImplementation(() => {
      return {
        symbol: 'ETH',
        decimals,
      }
    })

    // when
    const result = await getRefundParams(transaction, getTokenInfoMock)

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(getTokenInfoMock).toBeCalled()
  })
  it('Given a transaction with the gasPrice = 100, the baseGas = 100, the txGas = 100 and 1 decimal, returns 2000.0', async () => {
    // given
    const gasPrice = '100'
    const baseGas = 100
    const safeTxGas = 100
    const decimals = 1
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', gasPrice, baseGas, safeTxGas })

    const expectedResult = {
      fee: `2000.0`,
      symbol: 'ETH',
    }

    const getTokenInfoMock = jest.fn().mockImplementation(() => {
      return {
        symbol: 'ETH',
        decimals,
      }
    })

    // when
    const result = await getRefundParams(transaction, getTokenInfoMock)

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(getTokenInfoMock).toBeCalled()
  })
  it('It should return 0.50000 if given a transaction with the gasPrice = 100, the baseGas = 100, the txGas = 400 and 5 decimals', async () => {
    // given
    const gasPrice = '100'
    const baseGas = 100
    const safeTxGas = 400
    const decimals = 5
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', gasPrice, baseGas, safeTxGas })

    const expectedResult = {
      fee: `0.50000`,
      symbol: 'ETH',
    }

    const getTokenInfoMock = jest.fn().mockImplementation(() => {
      return {
        symbol: 'ETH',
        decimals,
      }
    })

    // when
    const result = await getRefundParams(transaction, getTokenInfoMock)

    // then
    expect(result).toStrictEqual(expectedResult)
    expect(getTokenInfoMock).toBeCalled()
  })
})

describe('generateSafeTxHash', () => {
  it('It should return a safe transaction hash', () => {
    // given
    const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const userAddress3 = 'address3'
    const safeInstance = getMockedSafeInstance({})
    const txArgs = {
      baseGas: 100,
      data: '',
      gasPrice: '1000',
      gasToken: '',
      nonce: 0,
      operation: 0,
      refundReceiver: userAddress,
      safeInstance,
      safeTxGas: 1000,
      sender: userAddress2,
      sigs: '',
      to: userAddress3,
      valueInWei: '5000',
    }

    // when
    const result = generateSafeTxHash(safeAddress, txArgs)

    // then
    expect(result).toBe('0x21e6ebc992f959dd0a2a6ce6034c414043c598b7f446c274efb3527c30dec254')
  })
})
