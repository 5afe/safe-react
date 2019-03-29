// @flow
import TestUtils from 'react-dom/test-utils'
import { List } from 'immutable'
import Transaction from '~/routes/safe/component/Transactions/Transaction'
import {
  listTxsClickingOn,
  LIST_TXS_INDEX,
  ADD_OWNERS_INDEX,
  EXPAND_OWNERS_INDEX,
  EDIT_THRESHOLD_INDEX,
  refreshTransactions,
  EXPAND_BALANCE_INDEX,
} from '~/test/builder/safe.dom.utils'
import { renderSafeInDom, type DomSafe } from '~/test/builder/safe.dom.builder'
import {
  sendMoveFundsForm,
  checkMinedMoveFundsTx,
  checkPendingMoveFundsTx,
} from '~/test/utils/transactions/moveFunds.helper'
import {
  sendAddOwnerForm,
  checkMinedAddOwnerTx,
  checkPendingAddOwnerTx,
} from '~/test/utils/transactions/addOwner.helper'
import {
  sendRemoveOwnerForm,
  checkMinedRemoveOwnerTx,
  checkPendingRemoveOwnerTx,
} from '~/test/utils/transactions/removeOwner.helper'
import {
  checkMinedThresholdTx,
  sendChangeThresholdForm,
  checkThresholdOf,
} from '~/test/utils/transactions/threshold.helper'
import { checkBalanceOf } from '~/test/utils/tokenMovements'
import { sleep } from '~/utils/timer'
import { processTransaction } from '~/logic/safe/safeFrontendOperations'

describe('DOM > Feature > SAFE MULTISIG Transactions', () => {
  let domSafe: DomSafe
  it.only('mines correctly all multisig txs in a 1 owner & 1 threshold safe', async () => {
    // GIVEN one safe with 1 owner and 1 threshold
    const owners = 1
    const threshold = 1
    domSafe = await renderSafeInDom(owners, threshold)
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[EXPAND_BALANCE_INDEX], '0.01', accounts[1])
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 2', accounts[1])
    await sleep(1200)
    await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '2')

    // THEN
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    checkMinedMoveFundsTx(transactions[0], 'Send 0.01 ETH to')
    checkMinedAddOwnerTx(transactions[1], 'Add Owner Adol Metamask 2')
    checkMinedThresholdTx(transactions[2], "Change Safe's threshold")
  })

  it.only('mines withdraw process correctly all multisig txs in a 2 owner & 2 threshold safe', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[EXPAND_BALANCE_INDEX], '0.01', accounts[1])
    const increaseThreshold = true
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 3', accounts[2], increaseThreshold)

    // THEN
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    const statusses = ['Adol 1 Eth Account [Confirmed]']
    await checkPendingMoveFundsTx(transactions[3], 2, 'Send 0.01 ETH to', statusses)
    await checkPendingAddOwnerTx(transactions[4], 2, 'Add Owner Adol Metamask 3', statusses)
    await checkBalanceOf(address, '0.09')
  })

  it.only('approves and executes pending transactions', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    let transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    expect(transactions.length).toBe(5)
    await checkThresholdOf(address, 2)

    // WHEN... processing pending TXs
    await processTransaction(address, transactions[3].props.transaction, 1, accounts[1], 2, List([accounts[0]]))
    await processTransaction(address, transactions[4].props.transaction, 1, accounts[1], 2, List([accounts[0]]))
    await refreshTransactions(store, address)

    // THEN
    checkMinedMoveFundsTx(transactions[3], 'Send 0.01 ETH to')
    await checkBalanceOf(address, '0.08')
    checkMinedAddOwnerTx(transactions[4], 'Add Owner Adol Metamask 3')
    await checkThresholdOf(address, 3)

    // WHEN... reducing threshold
    await sendRemoveOwnerForm(SafeDom, safeButtons[EXPAND_OWNERS_INDEX])

    // THEN
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    expect(transactions.length).toBe(6)
    let statusses = ['Adol 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(transactions[5], 3, 'Remove Owner Adol Metamask 3', statusses)

    await processTransaction(address, transactions[5].props.transaction, 1, accounts[2], 3, List([accounts[0]]))
    await refreshTransactions(store, address)

    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    statusses = ['Adol Metamask 3 [Confirmed]', 'Adol 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(transactions[5], 3, 'Remove Owner Adol Metamask 3', statusses)
    await checkThresholdOf(address, 3)
    await processTransaction(
      address,
      transactions[5].props.transaction,
      2,
      accounts[1],
      3,
      List([accounts[0], accounts[2]]),
    )

    await refreshTransactions(store, address)
    await checkThresholdOf(address, 2)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await checkMinedRemoveOwnerTx(transactions[5], 'Remove Owner')

    // WHEN... changing threshold
    await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '1')
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)

    // THEN
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await processTransaction(address, transactions[6].props.transaction, 1, accounts[1], 2, List([accounts[0]]))
    await checkThresholdOf(address, 1)
  })
})
