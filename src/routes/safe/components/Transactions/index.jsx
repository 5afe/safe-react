// @flow
import { List } from 'immutable'
import React from 'react'

import TxsTable from '~/routes/safe/components/Transactions/TxsTable'
import { type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import { type Transaction } from '~/routes/safe/store/models/transaction'

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
    cancellationTransactions={cancellationTransactions}
    createTransaction={createTransaction}
    currentNetwork={currentNetwork}
    granted={granted}
    nonce={nonce}
    owners={owners}
    processTransaction={processTransaction}
    safeAddress={safeAddress}
    threshold={threshold}
    transactions={transactions}
    userAddress={userAddress}
  />
)

export default Transactions
