// @flow
import TestUtils from 'react-dom/test-utils'
import Transaction from '~/routes/safe/component/Transactions/Transaction'
import { listTxsClickingOn, LIST_TXS_INDEX, ADD_OWNERS_INDEX, EXPAND_OWNERS_INDEX, EDIT_THRESHOLD_INDEX, WITHDRAW_INDEX, refreshTransactions, EXPAND_BALANCE_INDEX } from '~/test/builder/safe.dom.utils'
import { renderSafeInDom, type DomSafe } from '~/test/builder/safe.dom.builder'
import { sendMoveFundsForm, checkMinedMoveFundsTx, checkPendingMoveFundsTx } from '~/test/utils/transactions/moveFunds.helper'
import { sendAddOwnerForm, checkMinedAddOwnerTx, checkPendingAddOwnerTx } from '~/test/utils/transactions/addOwner.helper'
import { sendRemoveOwnerForm, checkMinedRemoveOwnerTx, checkPendingRemoveOwnerTx } from '~/test/utils/transactions/removeOwner.helper'
import { checkMinedThresholdTx, sendChangeThresholdForm, checkThresholdOf } from '~/test/utils/transactions/threshold.helper'
import { sendWithdrawForm, checkMinedWithdrawTx } from '~/test/utils/transactions/withdraw.helper'
import { checkBalanceOf } from '~/test/utils/tokenMovements'
import { sleep } from '~/utils/timer'
import { processTransaction } from '~/logic/safe/safeFrontendOperations'
import { allowedModulesInTxHistoryService } from '~/config'

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

    const allowedModules = allowedModulesInTxHistoryService()
    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[EXPAND_BALANCE_INDEX], '0.01', accounts[1])
    if (allowedModules) {
      await sendWithdrawForm(SafeDom, safeButtons[WITHDRAW_INDEX], '0.01', accounts[3])
    }
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 2', accounts[1])
    await sleep(1200)
    await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '2')

    // THEN
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    checkMinedMoveFundsTx(transactions[0], 'Send 0.01 ETH to')
    if (allowedModules) {
      await checkMinedWithdrawTx(transactions[1], 'Withdraw movement of 0.01', address, '0.08') // 0.1 - 0.01 tx - 0.01 withdraw
      checkMinedAddOwnerTx(transactions[2], 'Add Owner Adol Metamask 2')
      checkMinedThresholdTx(transactions[3], 'Change Safe\'s threshold')
    } else {
      checkMinedAddOwnerTx(transactions[1], 'Add Owner Adol Metamask 2')
      checkMinedThresholdTx(transactions[2], 'Change Safe\'s threshold')
    }
  })

  it.only('mines withdraw process correctly all multisig txs in a 2 owner & 2 threshold safe', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    const allowedModules = allowedModulesInTxHistoryService()
    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[EXPAND_BALANCE_INDEX], '0.01', accounts[1])
    const increaseThreshold = true
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 3', accounts[2], increaseThreshold)
    if (allowedModules) {
      await sendWithdrawForm(SafeDom, safeButtons[WITHDRAW_INDEX], '0.01', accounts[3])
    }

    // THEN
    await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    if (allowedModules) {
      const statusses = ['Adol 1 Eth Account [Confirmed]']
      await checkPendingMoveFundsTx(transactions[4], 2, 'Send 0.01 ETH to', statusses)
      await checkPendingAddOwnerTx(transactions[5], 2, 'Add Owner Adol Metamask 3', statusses)
      await checkMinedWithdrawTx(transactions[6], 'Withdraw movement of 0.01', address, '0.07')
    } else {
      const statusses = ['Adol 1 Eth Account [Confirmed]']
      await checkPendingMoveFundsTx(transactions[3], 2, 'Send 0.01 ETH to', statusses)
      await checkPendingAddOwnerTx(transactions[4], 2, 'Add Owner Adol Metamask 3', statusses)
      await checkBalanceOf(address, '0.09')
    }
  })

  it.only('approves and executes pending transactions', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    const allowedModules = allowedModulesInTxHistoryService()

    if (allowedModules) {
      let transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      expect(transactions.length).toBe(7)
      await checkThresholdOf(address, 3)

      // WHEN... processing pending TXs
      await processTransaction(address, transactions[4].props.transaction, 1, accounts[1], 3)
      await processTransaction(address, transactions[5].props.transaction, 1, accounts[1], 3)
      await refreshTransactions(store, address)

      // THEN
      checkMinedMoveFundsTx(transactions[4], 'Send 0.01 ETH to')
      await checkBalanceOf(address, '0.06')
      checkMinedAddOwnerTx(transactions[5], 'Add Owner Adol Metamask 3')
      await checkThresholdOf(address, 3)

      // WHEN... reducing threshold
      await sendRemoveOwnerForm(SafeDom, safeButtons[EXPAND_OWNERS_INDEX])

      // THEN
      await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      expect(transactions.length).toBe(8)
      let statusses = ['Adol Metamask 3 [Not confirmed]', 'Adol Metamask 2 [Not confirmed]', 'Adol 1 Eth Account [Confirmed]']
      await checkPendingRemoveOwnerTx(transactions[7], 3, 'Remove Owner Adol Metamask 3', statusses)

      await processTransaction(address, transactions[7].props.transaction, 1, accounts[1], 3)
      await refreshTransactions(store, address)
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      statusses = ['Adol Metamask 3 [Not confirmed]', 'Adol Metamask 2 [Confirmed]', 'Adol 1 Eth Account [Confirmed]']
      await checkPendingRemoveOwnerTx(transactions[7], 2, 'Remove Owner Adol Metamask 3', statusses)
      await checkThresholdOf(address, 3)

      await processTransaction(address, transactions[7].props.transaction, 2, accounts[2], 3)
      await refreshTransactions(store, address)
      await checkThresholdOf(address, 2)
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      await checkMinedRemoveOwnerTx(transactions[7], 'Remove Owner')

      // WHEN... changing threshold
      await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '1')
      await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)

      // THEN
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      await processTransaction(address, transactions[8].props.transaction, 1, accounts[1], 2)
      await checkThresholdOf(address, 1)
    } else {
      let transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      expect(transactions.length).toBe(5)
      await checkThresholdOf(address, 2)

      // WHEN... processing pending TXs
      await processTransaction(address, transactions[3].props.transaction, 1, accounts[1], 2)
      await processTransaction(address, transactions[4].props.transaction, 1, accounts[1], 2)
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

      await processTransaction(address, transactions[5].props.transaction, 1, accounts[2], 3)
      await refreshTransactions(store, address)

      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      statusses = ['Adol 1 Eth Account [Confirmed]', 'Adol Metamask 3 [Confirmed]']
      await checkPendingRemoveOwnerTx(transactions[5], 3, 'Remove Owner Adol Metamask 3', statusses)
      await checkThresholdOf(address, 3)
      await processTransaction(address, transactions[5].props.transaction, 2, accounts[1], 3)

      await refreshTransactions(store, address)
      await checkThresholdOf(address, 2)
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      await checkMinedRemoveOwnerTx(transactions[5], 'Remove Owner')

      // WHEN... changing threshold
      await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '1')
      await listTxsClickingOn(store, safeButtons[LIST_TXS_INDEX], address)

      // THEN
      transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
      await processTransaction(address, transactions[6].props.transaction, 1, accounts[1], 2)
      await checkThresholdOf(address, 1)
    }
  })
})
