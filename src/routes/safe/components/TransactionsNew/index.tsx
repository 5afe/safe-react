import React from 'react'
import { useSelector } from 'react-redux'
import { newTransactionsSelector } from '../../store/selectors/newTransactions'
import { useFetchNewTransactions } from '../../container/hooks/useFetchNewTransactions'
import { safeParamAddressFromStateSelector } from '../../store/selectors'

const Transactions = (): React.ReactElement => {
  const transactions = useSelector(newTransactionsSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  useFetchNewTransactions({ safeAddress })

  if (!transactions || !transactions[safeAddress]) return <div>No txs available for safe: {safeAddress}</div>

  return transactions[safeAddress].map((tx, index) => {
    const txHash = tx.transactionHash || tx.txHash
    return <div key={index}>Tx hash: {txHash}</div>
  })
}

export default Transactions
