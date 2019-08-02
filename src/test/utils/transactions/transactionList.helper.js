// @flow
import { fireEvent } from '@testing-library/react'
import { sleep } from '~/utils/timer'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { TRANSACTIONS_TAB_BTN_TEST_ID } from '~/routes/safe/components/Layout'
import { TRANSACTION_ROW_TEST_ID } from '~/routes/safe/components/TransactionsNew/TxsTable'
import {
  TRANSACTIONS_DESC_ADD_OWNER_TEST_ID,
  TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID,
  TRANSACTIONS_DESC_SEND_TEST_ID,
} from '~/routes/safe/components/TransactionsNew/TxsTable/ExpandedTx/TxDescription'

export const getLastTransaction = async (SafeDom: React.Component<any, any>) => {
  // Travel to transactions
  const transactionsBtn = SafeDom.getByTestId(TRANSACTIONS_TAB_BTN_TEST_ID)
  fireEvent.click(transactionsBtn)
  await sleep(200)

  // Check the last transaction was registered
  const transactionRows = SafeDom.getAllByTestId(TRANSACTION_ROW_TEST_ID)
  expect(transactionRows.length).toBe(1)
  fireEvent.click(transactionRows[0])
}

export const checkRegisteredTxSend = async (
  SafeDom: React.Component<any, any>,
  ethAmount: number,
  symbol: string,
  ethAddress: string,
) => {
  await getLastTransaction(SafeDom)

  const txDescription = SafeDom.getAllByTestId(TRANSACTIONS_DESC_SEND_TEST_ID)[0]
  expect(txDescription).toHaveTextContent(`Send ${ethAmount} ${symbol} to:${shortVersionOf(ethAddress, 4)}`)
}

export const checkRegisteredTxAddOwner = async (
  SafeDom: React.Component<any, any>,
  ownerAddress: string,
) => {
  await getLastTransaction(SafeDom)

  const txDescription = SafeDom.getAllByTestId(TRANSACTIONS_DESC_ADD_OWNER_TEST_ID)[0]
  expect(txDescription).toHaveTextContent(`Add owner:${shortVersionOf(ownerAddress, 4)}`)
}

export const checkRegisteredTxRemoveOwner = async (
  SafeDom: React.Component<any, any>,
  ownerAddress: string,
) => {
  await getLastTransaction(SafeDom)

  const txDescription = SafeDom.getAllByTestId(TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID)[0]
  expect(txDescription).toHaveTextContent(`Remove owner:${shortVersionOf(ownerAddress, 4)}`)
}

export const checkRegisteredTxReplaceOwner = async (
  SafeDom: React.Component<any, any>,
  oldOwnerAddress: string,
  newOwnerAddress: string,
) => {
  await getLastTransaction(SafeDom)

  const txDescriptionRemove = SafeDom.getAllByTestId(TRANSACTIONS_DESC_REMOVE_OWNER_TEST_ID)[0]
  expect(txDescriptionRemove).toHaveTextContent(`Remove owner:${shortVersionOf(oldOwnerAddress, 4)}`)
  const txDescriptionAdd = SafeDom.getAllByTestId(TRANSACTIONS_DESC_ADD_OWNER_TEST_ID)[0]
  expect(txDescriptionAdd).toHaveTextContent(`Add owner:${shortVersionOf(newOwnerAddress, 4)}`)
}
