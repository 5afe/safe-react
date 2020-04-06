// 
import { List } from 'immutable'
import React from 'react'

import TxsTable from 'src/routes/safe/components/Transactions/TxsTable'
import { } from 'src/routes/safe/store/models/incomingTransaction'
import { } from 'src/routes/safe/store/models/owner'
import { } from 'src/routes/safe/store/models/transaction'


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
}) => (
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
