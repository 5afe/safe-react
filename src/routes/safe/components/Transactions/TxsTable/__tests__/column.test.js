// 
import { List } from 'immutable'
import { makeTransaction } from 'src/routes/safe/store/models/transaction'
import { getTxTableData, TX_TABLE_RAW_CANCEL_TX_ID } from 'src/routes/safe/components/Transactions/TxsTable/columns'

describe('TxsTable Columns > getTxTableData', () => {
  it('should include CancelTx object inside TxTableData', () => {
    // Given
    const mockedTransaction = makeTransaction({ nonce: 1, blockNumber: 100 })
    const mockedCancelTransaction = makeTransaction({ nonce: 1, blockNumber: 123 })

    // When
    const txTableData = getTxTableData(List([mockedTransaction]), List([mockedCancelTransaction]))
    const txRow = txTableData.first()

    // Then
    expect(txRow[TX_TABLE_RAW_CANCEL_TX_ID]).toEqual(mockedCancelTransaction)
  })
  it('should not include CancelTx object inside TxTableData', () => {
    // Given
    const mockedTransaction = makeTransaction({ nonce: 1, blockNumber: 100 })
    const mockedCancelTransaction = makeTransaction({ nonce: 2, blockNumber: 123 })

    // When
    const txTableData = getTxTableData(List([mockedTransaction]), List([mockedCancelTransaction]))
    const txRow = txTableData.first()

    // Then
    expect(txRow[TX_TABLE_RAW_CANCEL_TX_ID]).toBeUndefined()
  })
})
