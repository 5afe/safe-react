import { isApproveAndExecute, isMultisigCreation } from 'src/routes/safe/components/Transactions/helpers/TxModalWrapper'

describe('isMultisigCreation', () => {
  it(`should return true if there are no confirmations for the transaction`, () => {
    // given
    const transactionConfirmations = 0

    // when
    const result = isMultisigCreation(transactionConfirmations)

    // then
    expect(result).toBe(true)
  })

  it(`should return false if there are confirmations for the transaction`, () => {
    // given
    const transactionConfirmations = 2

    // when
    const result = isMultisigCreation(transactionConfirmations)

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
    const preApprovingOwner = mockedEthAccount

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations, preApprovingOwner)

    // then
    expect(result).toBe(true)
  })
  it(`should return false if there is only one confirmation left to reach the safe threshold but there is no preApproving account`, () => {
    // given
    const transactionConfirmations = 2
    const safeThreshold = 3

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations)

    // then
    expect(result).toBe(false)
  })

  it(`should return false if there is more than one confirmation missing to reach the safe threshold`, () => {
    // given
    const transactionConfirmations = 0
    const safeThreshold = 3

    // when
    const result = isApproveAndExecute(safeThreshold, transactionConfirmations)

    // then
    expect(result).toBe(false)
  })
})
