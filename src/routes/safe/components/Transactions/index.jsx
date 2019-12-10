// @flow
import React, { useEffect } from 'react'
import { List } from 'immutable'
import NoTransactions from '~/routes/safe/components/Transactions/NoTransactions'
import TxsTable from '~/routes/safe/components/Transactions/TxsTable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'

type Props = {
  safeAddress: string,
  threshold: number,
  fetchTransactions: Function,
  transactions: List<Transaction>,
  incomingTransactions: List<IncomingTransaction>,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  createTransaction: Function,
  processTransaction: Function,
  currentNetwork: string,
}

const Transactions = ({
  transactions = List(),
  incomingTransactions = List(),
  owners,
  threshold,
  userAddress,
  granted,
  safeAddress,
  createTransaction,
  processTransaction,
  fetchTransactions,
  currentNetwork,
}: Props) => {
  useEffect(() => {
    fetchTransactions(safeAddress)
  }, [safeAddress])

  const hasTransactions = transactions.size > 0 || incomingTransactions.size > 0

  return (
    <>
      {hasTransactions ? (
        <TxsTable
          transactions={transactions}
          incomingTransactions={incomingTransactions}
          threshold={threshold}
          owners={owners}
          userAddress={userAddress}
          currentNetwork={currentNetwork}
          granted={granted}
          safeAddress={safeAddress}
          createTransaction={createTransaction}
          processTransaction={processTransaction}
        />
      ) : (
        <NoTransactions />
      )}
    </>
  )
}

export default Transactions
