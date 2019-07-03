// @flow
import React, { useEffect } from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/TransactionsNew/NoTransactions'
import TxsTable from '~/routes/safe/components/TransactionsNew/TxsTable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type Owner } from '~/routes/safe/store/models/owner'

type Props = {
  safeAddress: string,
  threshold: number,
  fetchTransactions: Function,
  transactions: List<Transaction>,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  createTransaction: Function,
}

const Transactions = ({
  transactions = List(),
  owners,
  threshold,
  userAddress,
  granted,
  safeAddress,
  createTransaction,
  fetchTransactions,
}: Props) => {
  useEffect(() => {
    fetchTransactions(safeAddress)
  }, [safeAddress])

  const hasTransactions = transactions.size > 0

  return (
    <React.Fragment>
      {hasTransactions ? (
        <TxsTable
          transactions={transactions}
          threshold={threshold}
          owners={owners}
          userAddress={userAddress}
          granted={granted}
          safeAddress={safeAddress}
          createTransaction={createTransaction}
        />
      ) : (
        <NoTransactions />
      )}
    </React.Fragment>
  )
}

export default Transactions
