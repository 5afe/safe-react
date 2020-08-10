import { getMockedTxServiceModel } from 'src/test/utils/safeHelper'
import { isInnerTransaction } from 'src/routes/safe/store/actions/transactions/utils/transactionHelpers'
import { makeTransaction } from 'src/routes/safe/store/models/transaction'

describe('isInnerTransaction', () => {
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  const safeAddress2 = '0x344B941b1aAE2e4Be73987212FC4741687Bf0503'
  it('The transaction to is our given safeAddress and the txValue is 0, should return true',   () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '0'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('The transaction to is our given safeAddress and the txValue is >0, should return false',   () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress, value: '100'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('The transaction to is not our given safeAddress, should return false',   () => {
    // given
    const transaction = getMockedTxServiceModel({ to: safeAddress2, value: '0'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('The transaction recipient is the given safeAddress and the txValue is 0, should return true',   () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress, value: '0'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(true)
  })
  it('The transaction recipient is the given safeAddress and the txValue is >0, should return false',   () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress, value: '100'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
  it('The transaction recipient is not the given safeAddress, should return false',   () => {
    // given
    const transaction = makeTransaction({ recipient: safeAddress2, value: '100'})

    // when
    const result = isInnerTransaction(transaction, safeAddress)

    // then
    expect(result).toBe(false)
  })
})

describe('isCancelTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isPendingTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isModifySettingsTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isMultiSendTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isUpgradeTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isOutgoingTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isCustomTransaction', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('getRefundParams', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('getDecodedParams', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('isTransactionCancelled', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('calculateTransactionStatus', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('calculateTransactionType', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})


describe('buildTx', async () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('updateStoredTransactionsStatus', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})

describe('generateSafeTxHash', () => {
  it('',   () => {
    // given

    // when


    // then

  })
})
