import { getNewTxNonce, shouldExecuteTransaction } from 'src/routes/safe/store/actions/utils'

describe('Store actions utils > getNewTxNonce', () => {
  it(`should return txNonce if it's a valid value`, async () => {
    // Given
    const txNonce = '45'
    const lastTx = {
      nonce: 44
    }
    const safeInstance = {
      nonce: () => Promise.resolve({
        toString: () => Promise.resolve('45')
      })
    }

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance)

    // Then
    expect(nonce).toBe('45')
  })

  it(`should return lastTx.nonce + 1 if txNonce is not valid`, async () => {
    // Given
    const txNonce = ''
    const lastTx = {
      nonce: 44
    }
    const safeInstance = {
      nonce: () => Promise.resolve({
        toString: () => Promise.resolve('45')
      })
    }

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance)

    // Then
    expect(nonce).toBe('45')
  })

  it(`should retrieve contract's instance nonce value, if txNonce and lastTx are not valid`, async () => {
    // Given
    const txNonce = ''
    const lastTx = null
    const safeInstance = {
      nonce: () => Promise.resolve({
        toString: () => Promise.resolve('45')
      })
    }

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance)

    // Then
    expect(nonce).toBe('45')
  })
})

describe('Store actions utils > shouldExecuteTransaction', () => {
  it(`should return false if there's a previous tx pending to be executed`, async () => {
    // Given
    const safeInstance = {
      getThreshold: () => Promise.resolve({
        toNumber: () => 1
      })
    }
    const nonce = '1'
    const lastTx = {
      isExecuted: false
    }

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // Then
    expect(isExecution).toBeFalsy()
  })

  it(`should return false if threshold is greater than 1`, async () => {
    // Given
    const safeInstance = {
      getThreshold: () => Promise.resolve({
        toNumber: () => 2
      })
    }
    const nonce = '1'
    const lastTx = {
      isExecuted: true
    }

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // Then
    expect(isExecution).toBeFalsy()
  })

  it(`should return true is threshold is 1 and previous tx is executed`, async () => {
    // Given
    const safeInstance = {
      getThreshold: () => Promise.resolve({
        toNumber: () => 1
      })
    }
    const nonce = '1'
    const lastTx = {
      isExecuted: true
    }

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance, nonce, lastTx)

    // Then
    expect(isExecution).toBeTruthy()
  })
})
