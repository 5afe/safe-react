import { getMockedSafeInstance, getMockedTxServiceModel } from 'src/test/utils/safeHelper'

import { makeTransaction } from 'src/logic/safe/store/models/transaction'
import { TransactionStatus, TransactionTypes } from 'src/logic/safe/store/models/types/transaction'
import makeSafe from 'src/logic/safe/store/models/safe'
import { List, Map, Record } from 'immutable'
import { makeToken, TokenProps } from 'src/logic/tokens/store/model/token'
import { EMPTY_DATA } from 'src/logic/wallets/ethTransactions'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import {
  buildTx,
  calculateTransactionStatus,
  calculateTransactionType,
  generateSafeTxHash,
  getRefundParams,
  isCancelTransaction,
  isCustomTransaction,
  isInnerTransaction,
  isModifySettingsTransaction,
  isMultiSendTransaction,
  isOutgoingTransaction,
  isPendingTransaction,
  isUpgradeTransaction,
} from 'src/logic/safe/store/actions/transactions/utils/transactionHelpers'
import { getERC20DecimalsAndSymbol } from 'src/logic/tokens/utils/tokenHelpers'

const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
describe('isInnerTransaction', () => {
  it('It should return true if the transaction recipient is our given safeAddress and the txValue is 0', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if the transaction recipient is our given safeAddress and the txValue is >0', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '100' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('It should return false if the transaction recipient is not our given safeAddress', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('It should return true if the transaction recipient is the given safeAddress and the txValue is 0', () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress, value: '0' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if the transaction recipient is the given safeAddress and the txValue is >0', () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress, value: '100' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('It should return false if the transaction recipient is not the given safeAddress', () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress2, value: '100' })

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
})

describe('isCancelTransaction', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  it('It should return false if given a inner transaction with empty data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })

    // when
    const result = isCancelTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if given a inner transaction without empty data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: 'test' })

    // when
    const result = isCancelTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
})

describe('isPendingTransaction', () => {
  it('It should return true if the transaction is on pending status', () => {
    // given
    const transaction = makeTransaction({ status: TransactionStatus.PENDING })
    const cancelTx = makeTransaction({ data: null })

    // when
    const result = isPendingTransaction(transaction, cancelTx)

    // then
    expect(result).toBe(true)
  })
  it('It should return true If the transaction is not pending status but the cancellation transaction is', () => {
    // given
    const transaction = makeTransaction({ status: TransactionStatus.AWAITING_CONFIRMATIONS })
    const cancelTx = makeTransaction({ status: TransactionStatus.PENDING })

    // when
    const result = isPendingTransaction(transaction, cancelTx)

    // then
    expect(result).toBe(true)
  })
  it('It should return true If the transaction and a cancellation transaction are not pending', () => {
    // given
    const transaction = makeTransaction({ status: TransactionStatus.CANCELLED })
    const cancelTx = makeTransaction({ status: TransactionStatus.AWAITING_CONFIRMATIONS })

    // when
    const result = isPendingTransaction(transaction, cancelTx)

    // then
    expect(result).toBe(false)
  })
})

describe('isModifySettingsTransaction', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  it('It should return true if given an inner transaction without empty data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: 'test' })

    // when
    const result = isModifySettingsTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('It should return false if given an inner transaction with empty data', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })

    // when
    const result = isModifySettingsTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
})

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

describe('isOutgoingTransaction', () => {
  it('It should return true if the transaction recipient is not a safe address and data is not empty', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', data: 'test' })

    // when
    const result = isOutgoingTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('It should return true if the transaction has an address equal to the safe address', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: 'test' })

    // when
    const result = isOutgoingTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('It should return false if the transaction recipient is not a safe address and data is empty', () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0', data: null })

    // when
    const result = isOutgoingTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
})

jest.mock('src/logic/tokens/utils/tokenHelpers')
describe('isCustomTransaction', () => {
  afterAll(() => {
    jest.unmock('src/logic/tokens/utils/tokenHelpers')
  })
  it('It should return true if Is outgoing transaction, is not an erc20 transaction, not an upgrade transaction and not and erc721 transaction', async () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', data: 'test' })
    const txCode = ''
    const knownTokens = Map<string, Record<TokenProps> & Readonly<TokenProps>>()
    const token = makeToken({
      address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    })
    knownTokens.set('0x00Df91984582e6e96288307E9c2f20b38C8FeCE9', token)

    const txHelpers = require('src/logic/tokens/utils/tokenHelpers')

    txHelpers.isSendERC20Transaction.mockImplementationOnce(() => false)
    txHelpers.isSendERC721Transaction.mockImplementationOnce(() => false)

    // when
    const result = await isCustomTransaction(transaction, txCode, safeAddress, knownTokens)

    // then
    expect(result).toBe(true)
    expect(txHelpers.isSendERC20Transaction).toHaveBeenCalled()
    expect(txHelpers.isSendERC721Transaction).toHaveBeenCalled()
  })
  it('It should return true if is outgoing transaction, is not SendERC20Transaction, is not isUpgradeTransaction and not isSendERC721Transaction', async () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', data: 'test' })
    const txCode = ''
    const knownTokens = Map<string, Record<TokenProps> & Readonly<TokenProps>>()
    const token = makeToken({
      address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    })
    knownTokens.set('0x00Df91984582e6e96288307E9c2f20b38C8FeCE9', token)

    const txHelpers = require('src/logic/tokens/utils/tokenHelpers')

    txHelpers.isSendERC20Transaction.mockImplementationOnce(() => false)
    txHelpers.isSendERC721Transaction.mockImplementationOnce(() => false)

    // when
    const result = await isCustomTransaction(transaction, txCode, safeAddress, knownTokens)

    // then
    expect(result).toBe(true)
    expect(txHelpers.isSendERC20Transaction).toHaveBeenCalled()
    expect(txHelpers.isSendERC721Transaction).toHaveBeenCalled()
  })
  it('It should return false if is outgoing transaction, not SendERC20Transaction, isUpgradeTransaction and not isSendERC721Transaction', async () => {
    // given
    const upgradeTxData = `0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000f200dfa693da0d16f5e7e78fdcbede8fc6ebea44f1cf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000247de7edef000000000000000000000000d5d82b6addc9027b22dca772aa68d5d74cdbdf4400dfa693da0d16f5e7e78fdcbede8fc6ebea44f1cf00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024f08a032300000000000000000000000034cfac646f301356faa8b21e94227e3583fe3f5f0000000000000000000000000000`
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', data: upgradeTxData })
    const txCode = ''
    const knownTokens = Map<string, Record<TokenProps> & Readonly<TokenProps>>()
    const token = makeToken({
      address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    })
    knownTokens.set('0x00Df91984582e6e96288307E9c2f20b38C8FeCE9', token)

    const txHelpers = require('src/logic/tokens/utils/tokenHelpers')

    txHelpers.isSendERC20Transaction.mockImplementationOnce(() => true)
    txHelpers.isSendERC721Transaction.mockImplementationOnce(() => false)

    // when
    const result = await isCustomTransaction(transaction, txCode, safeAddress, knownTokens)

    // then
    expect(result).toBe(false)
    expect(txHelpers.isSendERC20Transaction).toHaveBeenCalled()
  })
  it('It should return false if is outgoing transaction, is not SendERC20Transaction, not isUpgradeTransaction and isSendERC721Transaction', async () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0', data: 'test' })
    const txCode = ''
    const knownTokens = Map<string, Record<TokenProps> & Readonly<TokenProps>>()
    const token = makeToken({
      address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    })
    knownTokens.set('0x00Df91984582e6e96288307E9c2f20b38C8FeCE9', token)

    const txHelpers = require('src/logic/tokens/utils/tokenHelpers')

    txHelpers.isSendERC20Transaction.mockImplementationOnce(() => false)
    txHelpers.isSendERC721Transaction.mockImplementationOnce(() => true)

    // when
    const result = await isCustomTransaction(transaction, txCode, safeAddress, knownTokens)

    // then
    expect(result).toBe(false)
    expect(txHelpers.isSendERC20Transaction).toHaveBeenCalled()
    expect(txHelpers.isSendERC721Transaction).toHaveBeenCalled()
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

describe('getDecodedParams', () => {
  it('', () => {
    // given
    // when
    // then
  })
})

describe('isTransactionCancelled', () => {
  it('', () => {
    // given
    // when
    // then
  })
})

describe('calculateTransactionStatus', () => {
  it('It should return SUCCESS if the tx is executed and successful', () => {
    // given
    const transaction = makeTransaction({ isExecuted: true, isSuccessful: true })
    const safe = makeSafe()
    const currentUser = safeAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.SUCCESS)
  })
  it('It should return CANCELLED if the tx is cancelled and successful', () => {
    // given
    const transaction = makeTransaction({ cancelled: true })
    const safe = makeSafe()
    const currentUser = safeAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.CANCELLED)
  })
  it('It should return AWAITING_EXECUTION if the tx has an amount of confirmations equal to the safe threshold', () => {
    // given
    const makeUser = Record({
      owner: '',
      type: '',
      hash: '',
      signature: '',
    })
    const transaction = makeTransaction({ cancelled: true, confirmations: List([makeUser(), makeUser(), makeUser()]) })
    const safe = makeSafe({ threshold: 3 })
    const currentUser = safeAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.CANCELLED)
  })
  it('It should return SUCCESS if the tx is the creation transaction', () => {
    // given
    const transaction = makeTransaction({ creationTx: true, confirmations: List() })
    const safe = makeSafe({ threshold: 3 })
    const currentUser = safeAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.SUCCESS)
  })
  it('It should return PENDING if the tx is pending', () => {
    // given
    const transaction = makeTransaction({ confirmations: List(), isPending: true })
    const safe = makeSafe({ threshold: 3 })
    const currentUser = safeAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.PENDING)
  })
  it('It should return AWAITING_CONFIRMATIONS if the tx has confirmations bellow the threshold, the user is owner and signed', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const makeUser = Record({
      owner: '',
      type: '',
      hash: '',
      signature: '',
    })
    const transaction = makeTransaction({ confirmations: List([makeUser({ owner: userAddress })]) })
    const safe = makeSafe({
      threshold: 3,
      owners: List([
        { name: '', address: userAddress },
        { name: '', address: userAddress2 },
      ]),
    })
    const currentUser = userAddress

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.AWAITING_CONFIRMATIONS)
  })
  it('It should return AWAITING_YOUR_CONFIRMATION if the tx has confirmations bellow the threshold, the user is owner and not signed', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const makeUser = Record({
      owner: '',
      type: '',
      hash: '',
      signature: '',
    })

    const transaction = makeTransaction({ confirmations: List([makeUser({ owner: userAddress })]) })
    const safe = makeSafe({
      threshold: 3,
      owners: List([
        { name: '', address: userAddress },
        { name: '', address: userAddress2 },
      ]),
    })
    const currentUser = userAddress2

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.AWAITING_YOUR_CONFIRMATION)
  })
  it('It should return AWAITING_CONFIRMATIONS if the tx has confirmations bellow the threshold, the user is not owner', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const makeUser = Record({
      owner: '',
      type: '',
      hash: '',
      signature: '',
    })

    const transaction = makeTransaction({ confirmations: List([makeUser({ owner: userAddress })]) })
    const safe = makeSafe({ threshold: 3, owners: List([{ name: '', address: userAddress }]) })
    const currentUser = userAddress2

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.AWAITING_CONFIRMATIONS)
  })
  it('It should return FAILED if the tx is not successful', () => {
    // given
    const userAddress = 'address1'
    const userAddress2 = 'address2'
    const makeUser = Record({
      owner: '',
      type: '',
      hash: '',
      signature: '',
    })

    const transaction = makeTransaction({
      confirmations: List([makeUser({ owner: userAddress })]),
      isSuccessful: false,
    })
    const safe = makeSafe({ threshold: 3, owners: List([{ name: '', address: userAddress }]) })
    const currentUser = userAddress2

    // when
    const result = calculateTransactionStatus(transaction, safe, currentUser)

    // then
    expect(result).toBe(TransactionStatus.FAILED)
  })
})

describe('calculateTransactionType', () => {
  it('It should return TOKEN If the tx is a token transfer transaction', () => {
    // given
    const transaction = makeTransaction({ isTokenTransfer: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.TOKEN)
  })
  it('It should return COLLECTIBLE If the tx is a collectible transfer transaction', () => {
    // given
    const transaction = makeTransaction({ isCollectibleTransfer: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.COLLECTIBLE)
  })
  it('It should return SETTINGS If the tx is a modifySettings transaction', () => {
    // given
    const transaction = makeTransaction({ modifySettingsTx: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.SETTINGS)
  })

  it('It should return CANCELLATION If the tx is a cancellation transaction', () => {
    // given
    const transaction = makeTransaction({ isCancellationTx: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.CANCELLATION)
  })

  it('It should return CUSTOM If the tx is a custom transaction', () => {
    // given
    const transaction = makeTransaction({ customTx: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.CUSTOM)
  })
  it('It should return CUSTOM If the tx is a creation transaction', () => {
    // given
    const transaction = makeTransaction({ creationTx: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.CREATION)
  })
  it('It should return UPGRADE If the tx is an upgrade transaction', () => {
    // given
    const transaction = makeTransaction({ upgradeTx: true })

    // when
    const result = calculateTransactionType(transaction)

    // then
    expect(result).toBe(TransactionTypes.UPGRADE)
  })
})

describe('buildTx', () => {
  it('Returns a valid transaction', async () => {
    // given
    const cancelTx1 = {
      baseGas: 0,
      blockNumber: 0,
      confirmations: [],
      confirmationsRequired: 2,
      data: null,
      dataDecoded: undefined,
      ethGasPrice: '0',
      executionDate: null,
      executor: '',
      fee: '',
      gasPrice: '',
      gasToken: '',
      gasUsed: 0,
      isExecuted: false,
      isSuccessful: true,
      modified: '',
      nonce: 0,
      operation: 0,
      origin: null,
      refundReceiver: '',
      safe: '',
      safeTxGas: 0,
      safeTxHash: '',
      signatures: '',
      submissionDate: null,
      to: '',
      transactionHash: null,
      value: '',
    }
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0' })
    const userAddress = 'address1'
    const cancellationTxs = List([cancelTx1])
    const token = makeToken({
      address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
      name: 'OmiseGo',
      symbol: 'OMG',
      decimals: 18,
      logoUri:
        'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    })
    const knownTokens = Map<string, Record<TokenProps> & Readonly<TokenProps>>()
    knownTokens.set('0x00Df91984582e6e96288307E9c2f20b38C8FeCE9', token)
    const outgoingTxs = [cancelTx1]
    const safeInstance = makeSafe({ name: 'LOADED SAFE', address: safeAddress })
    const expectedTx = makeTransaction({
      baseGas: 0,
      blockNumber: 0,
      cancelled: false,
      confirmations: List([]),
      creationTx: false,
      customTx: false,
      data: EMPTY_DATA,
      dataDecoded: null,
      decimals: 18,
      decodedParams: null,
      executionDate: '',
      executionTxHash: '',
      executor: '',
      gasPrice: '',
      gasToken: ZERO_ADDRESS,
      isCancellationTx: false,
      isCollectibleTransfer: false,
      isExecuted: false,
      isSuccessful: false,
      isTokenTransfer: false,
      modifySettingsTx: false,
      multiSendTx: false,
      nonce: 0,
      operation: 0,
      origin: '',
      recipient: safeAddress2,
      refundParams: null,
      refundReceiver: ZERO_ADDRESS,
      safeTxGas: 0,
      safeTxHash: '',
      setupData: '',
      status: TransactionStatus.FAILED,
      submissionDate: '',
      symbol: 'ETH',
      upgradeTx: false,
      value: '0',
      fee: '',
    })

    // when
    const txResult = await buildTx({
      cancellationTxs,
      currentUser: userAddress,
      knownTokens,
      outgoingTxs,
      safe: safeInstance,
      tx: transaction,
      txCode: undefined,
    })

    // then
    expect(txResult).toStrictEqual(expectedTx)
  })
})

describe('updateStoredTransactionsStatus', () => {
  it('', () => {
    // given
    // when
    // then
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
