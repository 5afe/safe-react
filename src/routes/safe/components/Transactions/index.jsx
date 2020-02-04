// @flow
import React from 'react'
import { List } from 'immutable'
import TxsTable from '~/routes/safe/components/Transactions/TxsTable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'

type Props = {
  safeAddress: string,
  threshold: number,
  transactions: List<Transaction | IncomingTransaction>,
  cancellationTransactions: List<Transaction>,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  createTransaction: Function,
  processTransaction: Function,
  currentNetwork: string,
  nonce: number,
}

const Transactions = ({
  transactions = List(),
  cancellationTransactions = List(),
  owners,
  threshold,
  userAddress,
  granted,
  safeAddress,
  createTransaction,
  processTransaction,
  currentNetwork,
  nonce,
}: Props) => (
  <TxsTable
    transactions={transactions}
    cancellationTransactions={cancellationTransactions}
    threshold={threshold}
    owners={owners}
    userAddress={userAddress}
    currentNetwork={currentNetwork}
    granted={granted}
    safeAddress={safeAddress}
    createTransaction={createTransaction}
    processTransaction={processTransaction}
    nonce={nonce}
  />
)

export default Transactions
