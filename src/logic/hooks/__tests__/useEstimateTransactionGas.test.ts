import {
  checkIfTxIsApproveAndExecution,
  checkIfTxIsCreation,
  checkIfTxIsExecution,
} from 'src/logic/hooks/useEstimateTransactionGas'

describe('checkIfTxIsExecution', () => {
  const mockedEthAccount = '0x29B1b813b6e84654Ca698ef5d7808E154364900B'
  it(`should return true if the safe threshold is 1`, () => {
    // given
    const threshold = 1
    const preApprovingOwner = undefined
    const transactionConfirmations = 0
    const transactionType = ''

    // when
    const result = checkIfTxIsExecution(threshold, preApprovingOwner, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return true if the safe threshold is reached for the transaction`, () => {
    // given
    const threshold = 3
    const preApprovingOwner = mockedEthAccount
    const transactionConfirmations = 3
    const transactionType = ''

    // when
    const result = checkIfTxIsExecution(threshold, preApprovingOwner, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return true if the transaction is spendingLimit`, () => {
    // given
    const threshold = 5
    const preApprovingOwner = undefined
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'

    // when
    const result = checkIfTxIsExecution(threshold, preApprovingOwner, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return true if the number of confirmations is one bellow the threshold but there is a preApprovingOwner`, () => {
    // given
    const threshold = 5
    const preApprovingOwner = mockedEthAccount
    const transactionConfirmations = 4
    const transactionType = undefined

    // when
    const result = checkIfTxIsExecution(threshold, preApprovingOwner, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if the number of confirmations is one bellow the threshold and there is no preApprovingOwner`, () => {
    // given
    const threshold = 5
    const preApprovingOwner = undefined
    const transactionConfirmations = 4
    const transactionType = undefined

    // when
    const result = checkIfTxIsExecution(threshold, preApprovingOwner, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
})
describe('checkIfTxIsCreation', () => {
  it(`should return true if there are no confirmations for the transaction and the transaction is not spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = ''

    // when
    const result = checkIfTxIsCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if there are no confirmations for the transaction and the transaction is spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'

    // when
    const result = checkIfTxIsCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
  it(`should return false if there are confirmations for the transaction`, () => {
    // given
    const transactionConfirmations = 2
    const transactionType = ''

    // when
    const result = checkIfTxIsCreation(transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
})

describe('checkIfTxIsApproveAndExecution', () => {
  it(`should return true if there is only one confirmation left to reach the safe threshold`, () => {
    // given
    const transactionConfirmations = 2
    const safeThreshold = 3
    const transactionType = ''

    // when
    const result = checkIfTxIsApproveAndExecution(safeThreshold, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return true if the transaction is spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = 'spendingLimit'
    const safeThreshold = 3

    // when
    const result = checkIfTxIsApproveAndExecution(safeThreshold, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if the are missing more than one confirmations to reach the safe threshold and the transaction is not spendingLimit`, () => {
    // given
    const transactionConfirmations = 0
    const transactionType = ''
    const safeThreshold = 3

    // when
    const result = checkIfTxIsApproveAndExecution(safeThreshold, transactionConfirmations, transactionType)

    // then
    expect(result).toBe(false)
  })
})
