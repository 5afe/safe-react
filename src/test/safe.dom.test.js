// @flow
import TestUtils from 'react-dom/test-utils'
import Transaction from '~/routes/safe/component/Transactions/Transaction'
import { listTxsClickingOn, LIST_TXS_INDEX, MOVE_FUNDS_INDEX, ADD_OWNERS_INDEX, EXPAND_OWNERS_INDEX, EDIT_THRESHOLD_INDEX, WITHDRAWN_INDEX, refreshTransactions } from '~/test/builder/safe.dom.utils'
import { renderSafeInDom, type DomSafe } from '~/test/builder/safe.dom.builder'
import { sendMoveFundsForm, checkMinedMoveFundsTx, checkPendingMoveFundsTx } from '~/test/utils/transactions/moveFunds.helper'
import { sendAddOwnerForm, checkMinedAddOwnerTx, checkPendingAddOwnerTx } from '~/test/utils/transactions/addOwner.helper'
import { sendRemoveOwnerForm, checkMinedRemoveOwnerTx, checkPendingRemoveOwnerTx } from '~/test/utils/transactions/removeOwner.helper'
import { checkMinedThresholdTx, sendChangeThresholdForm, checkThresholdOf } from '~/test/utils/transactions/threshold.helper'
import { sendWithdrawnForm, checkMinedWithdrawnTx } from '~/test/utils/transactions/withdrawn.helper'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import { checkBalanceOf } from '~/test/utils/etherMovements'

describe('DOM > Feature > SAFE MULTISIG TX 1 Owner 1 Threshold', () => {
  let domSafe: DomSafe
  it('mines correctly all multisig txs in a 1 owner & 1 threshold safe', async () => {
    // GIVEN one safe with 1 owner and 1 threshold
    const owners = 1
    const threshold = 1
    domSafe = await renderSafeInDom(owners, threshold)
    const {
      address, safe: SafeDom, safeButtons, accounts,
    } = domSafe

    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[MOVE_FUNDS_INDEX], 'Move funds', '0.01', accounts[1])
    await sendWithdrawnForm(SafeDom, safeButtons[WITHDRAWN_INDEX], '0.01', accounts[3])
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 2', accounts[1])
    await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '2')

    // THEN
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    checkMinedMoveFundsTx(transactions[0], 'Move funds')
    await checkMinedWithdrawnTx(address, '0.08') // 0.1 - 0.01 tx - 0.01 withdrawn
    checkMinedAddOwnerTx(transactions[1], 'Add Owner Adol Metamask 2')
    checkMinedThresholdTx(transactions[2], 'Change Safe\'s threshold')
  })

  it('mines withdraw process correctly all multisig txs in a 2 owner & 2 threshold safe', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts,
    } = domSafe

    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[MOVE_FUNDS_INDEX], 'Buy batteries', '0.01', accounts[1])
    const increaseThreshold = true
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 3', accounts[2], increaseThreshold)
    await sendWithdrawnForm(SafeDom, safeButtons[WITHDRAWN_INDEX], '0.01', accounts[3])

    // THEN
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    const statusses = ['Adol Metamask 2 [Not confirmed]', 'Adolfo 1 Eth Account [Confirmed]']
    await checkPendingMoveFundsTx(transactions[3], 2, 'Buy batteries', statusses)
    await checkPendingAddOwnerTx(transactions[4], 2, 'Add Owner Adol Metamask 3', statusses)
    // checkMinedThresholdTx(transactions[4], 'Add Owner Adol Metamask 3')
    await checkMinedWithdrawnTx(address, '0.07')
  })

  it('approves and executes pending transactions', async () => {
    // GIVEN reusing the state from previous test
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    let transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    expect(transactions.length).toBe(5)

    // WHEN... processing pending TXs
    await processTransaction(address, transactions[3].props.transaction, 1, accounts[1])
    await processTransaction(address, transactions[4].props.transaction, 1, accounts[1])
    await refreshTransactions(store)

    // THEN
    checkMinedMoveFundsTx(transactions[3], 'Buy batteries')
    await checkBalanceOf(address, '0.06')
    checkMinedAddOwnerTx(transactions[4], 'Add Owner Adol Metamask 3')
    await checkThresholdOf(address, 3)

    // WHEN... reducing threshold
    await sendRemoveOwnerForm(SafeDom, safeButtons[EXPAND_OWNERS_INDEX])

    // THEN
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    expect(transactions.length).toBe(6)
    let statusses = ['Adol Metamask 3 [Not confirmed]', 'Adol Metamask 2 [Not confirmed]', 'Adolfo 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(transactions[5], 3, 'Remove Owner Adol Metamask 3', statusses)

    await processTransaction(address, transactions[5].props.transaction, 1, accounts[1])
    await refreshTransactions(store)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    statusses = ['Adol Metamask 3 [Not confirmed]', 'Adol Metamask 2 [Confirmed]', 'Adolfo 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(transactions[5], 2, 'Remove Owner Adol Metamask 3', statusses)
    await checkThresholdOf(address, 3)

    await processTransaction(address, transactions[5].props.transaction, 2, accounts[2])
    await refreshTransactions(store)
    await checkThresholdOf(address, 2)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await checkMinedRemoveOwnerTx(transactions[5], 'Remove Owner')

    // WHEN... changing threshold
    await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], '1')
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])

    // THEN
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await processTransaction(address, transactions[6].props.transaction, 1, accounts[1])
    await checkThresholdOf(address, 1)
  })
})
