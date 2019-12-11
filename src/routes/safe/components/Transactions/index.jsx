// @flow
import React, { useEffect } from 'react'
import { List } from 'immutable'
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

const TIMEOUT = process.env.NODE_ENV === 'test' ? 1500 : 5000

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
  let intervalId: IntervalID

  useEffect(() => {
    fetchTransactions(safeAddress)

    intervalId = setInterval(() => {
      fetchTransactions(safeAddress)
    }, TIMEOUT)

    return () => clearInterval(intervalId)
  }, [safeAddress])

  return (
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
  )
}

export default Transactions
