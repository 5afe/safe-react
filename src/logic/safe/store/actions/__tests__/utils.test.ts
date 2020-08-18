import { getNewTxNonce, shouldExecuteTransaction } from 'src/logic/safe/store/actions/utils'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'

describe('Store actions utils > getNewTxNonce', () => {
  it(`Should return passed predicted transaction nonce if it's a valid value`, async () => {
    // Given
    const txNonce = '45'
    const lastTx = { nonce: 44 } as TxServiceModel
    const safeInstance = {}

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance as GnosisSafe)

    // Then
    expect(nonce).toBe('45')
  })

  it(`Should return nonce of a last transaction + 1 if passed nonce is less than last transaction or invalid`, async () => {
    // Given
    const txNonce = ''
    const lastTx = { nonce: 44 } as TxServiceModel
    const safeInstance = {
      methods: {
        nonce: () => ({
          call: () => Promise.resolve('45'),
        }),
      },
    }

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance as GnosisSafe)

    // Then
    expect(nonce).toBe('45')
  })

  it(`Should retrieve contract's instance nonce value as a fallback, if txNonce and lastTx are not valid`, async () => {
    // Given
    const txNonce = ''
    const lastTx = null
    const safeInstance = {
      methods: {
        nonce: () => ({
          call: () => Promise.resolve('45'),
        }),
      },
    }

    // When
    const nonce = await getNewTxNonce(txNonce, lastTx, safeInstance as GnosisSafe)

    // Then
    expect(nonce).toBe('45')
  })
})

describe('Store actions utils > shouldExecuteTransaction', () => {
  it(`should return false if there's a previous tx pending to be executed`, async () => {
    // Given
    const safeInstance = {
      methods: {
        getThreshold: () => ({
          call: () => Promise.resolve('1'),
        }),
      },
    }
    const nonce = '1'
    const lastTx = { isExecuted: false } as TxServiceModel

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance as GnosisSafe, nonce, lastTx)

    // Then
    expect(isExecution).toBeFalsy()
  })

  it(`should return false if threshold is greater than 1`, async () => {
    // Given
    const safeInstance = {
      methods: {
        getThreshold: () => ({
          call: () => Promise.resolve('2'),
        }),
      },
    }
    const nonce = '1'
    const lastTx = { isExecuted: true } as TxServiceModel

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance as GnosisSafe, nonce, lastTx)

    // Then
    expect(isExecution).toBeFalsy()
  })

  it(`should return true is threshold is 1 and previous tx is executed`, async () => {
    // Given
    const safeInstance = {
      methods: {
        getThreshold: () => ({
          call: () => Promise.resolve('1'),
        }),
      },
    }
    const nonce = '1'
    const lastTx = { isExecuted: true } as TxServiceModel

    // When
    const isExecution = await shouldExecuteTransaction(safeInstance as GnosisSafe, nonce, lastTx)

    // Then
    expect(isExecution).toBeTruthy()
  })
})
