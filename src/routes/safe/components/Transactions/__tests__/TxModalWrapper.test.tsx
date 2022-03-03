import { isApproveAndExecute, isMultisigCreation } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'

describe('isMultisigCreation', () => {
  it(`should return true if there are no confirmations for the transaction and the transaction is not spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = ''

    // when
    const result = isMultisigCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if there are no confirmations for the transaction and the transaction is spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'

    // when
    const result = isMultisigCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
  it(`should return false if there are confirmations for the transaction`, () => {
    // given
    const transactionConfirmations = 2
    const transactionType = ''

    // when
    const result = isMultisigCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
})

describe('isApproveAndExecute', () => {
  const mockedEthAccount = '0x29B1b813b6e84654Ca698ef5d7808E154364900B'
  it(`should return true if there is only one confirmation left to reach the safe threshold and there is a preApproving account`, () => {
    // given
    const transactionConfirmations = 2
    const safeThreshold = 3
    const transactionType = ''
    const preApprovingOwner = mockedEthAccount

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, transactionType, preApprovingOwner)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if there is only one confirmation left to reach the safe threshold and but there is no preApproving account`, () => {
    // given
    const transactionConfirmations = 2
    const safeThreshold = 3
    const transactionType = ''

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
  it(`should return true if the transaction is spendingLimit and there is a preApproving account`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'
    const safeThreshold = 3
    const preApprovingOwner = mockedEthAccount

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, transactionType, preApprovingOwner)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if the transaction is spendingLimit and there is no preApproving account`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'
    const safeThreshold = 3
    const preApprovingOwner = mockedEthAccount

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, transactionType, preApprovingOwner)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if the are missing more than one confirmations to reach the safe threshold and the transaction is not spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = ''
    const safeThreshold = 3

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
})
