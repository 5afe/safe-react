import { List, Map } from 'immutable'
import { makeTransaction } from 'src/logic/safe/store/models/transaction'
import { getTxTableData, TX_TABLE_RAW_CANCEL_TX_ID, TableData } from 'src/routes/safe/components/Transactions/TxsTable/columns'

describe('TxsTable Columns > getTxTableData', () => {
  it('should include CancelTx object inside TxTableData', () => {
    // Given
    const mockedTransaction = makeTransaction({ nonce: 1, blockNumber: 100 })
    const mockedCancelTransaction = makeTransaction({ nonce: 1, blockNumber: 123 })

    // When
    const txTableData = getTxTableData(List([mockedTransaction]), Map( { '1': mockedCancelTransaction }))
    const txRow = txTableData.first() as TableData

    // Then
    expect(txRow[TX_TABLE_RAW_CANCEL_TX_ID]).toEqual(mockedCancelTransaction)
  })
  it('should not include CancelTx object inside TxTableData', () => {
    // Given
    const mockedTransaction = makeTransaction({ nonce: 1, blockNumber: 100 })
    const mockedCancelTransaction = makeTransaction({ nonce: 2, blockNumber: 123 })

    // When
    const txTableData = getTxTableData(List([mockedTransaction]), Map( { '2': mockedCancelTransaction }))
    const txRow = txTableData.first() as TableData

    // Then
    expect(txRow[TX_TABLE_RAW_CANCEL_TX_ID]).toBeUndefined()
  })
})
