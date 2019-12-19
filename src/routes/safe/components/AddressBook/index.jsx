// @flow
import React from 'react'
import { List } from 'immutable'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import { type IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { type Owner } from '~/routes/safe/store/models/owner'
import AddressBookTable from '~/routes/safe/components/AddressBook/AddressBookTable'

type Props = {
  safeAddress: string,
  threshold: number,
  transactions: List<Transaction | IncomingTransaction>,
  owners: List<Owner>,
  userAddress: string,
  granted: boolean,
  createTransaction: Function,
  processTransaction: Function,
  currentNetwork: string,
  nonce: number,
}

const AddressBook = ({
  transactions = List(),
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
  <AddressBookTable
    transactions={transactions}
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

export default AddressBook
