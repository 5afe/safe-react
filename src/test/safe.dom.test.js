// @flow
import TestUtils from 'react-dom/test-utils'
import Transaction from '~/routes/safe/component/Transactions/Transaction'
import { listTxsClickingOn, LIST_TXS_INDEX, MOVE_FUNDS_INDEX, ADD_OWNERS_INDEX, EXPAND_OWNERS_INDEX } from '~/test/builder/safe.dom.utils'
import { renderSafeInDom, type DomSafe } from '~/test/builder/safe.dom.builder'
import { sendMoveFundsForm, checkMinedMoveFundsTx } from '~/test/utils/transactions/moveFunds.helper'
import { sendAddOwnerForm, checkMinedAddOwnerTx } from '~/test/utils/transactions/addOwner.helper'
import { sendRemoveOwnerForm, checkMinedRemoveOwnerTx } from '~/test/utils/transactions/removeOwner.helper'

describe('DOM > Feature > SAFE MULTISIG TX 1 Owner 1 Threshold', () => {
  let domSafe: DomSafe
  it('process correctly all multisig txs in a 1 owner & 1 threshold safe', async () => {
    // GIVEN one safe with 1 owner and 1 threshold
    const owners = 1
    const threshold = 1
    domSafe = await renderSafeInDom(owners, threshold)
    const { safe: SafeDom, safeButtons, accounts } = domSafe

    // WHEN
    await sendMoveFundsForm(SafeDom, safeButtons[MOVE_FUNDS_INDEX], 'Move funds', '0.01', accounts[1])
    await sendAddOwnerForm(SafeDom, safeButtons[ADD_OWNERS_INDEX], 'Adol Metamask 2', accounts[1])
    await sendRemoveOwnerForm(SafeDom, safeButtons[EXPAND_OWNERS_INDEX])
    // await sendChangeThresholdForm(SafeDom, safeButtons[EDIT_THRESHOLD_INDEX], 'Change Threshold to 2')

    // THEN
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])
    const transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)

    checkMinedMoveFundsTx(transactions[0], 'Move funds')
    checkMinedAddOwnerTx(transactions[1], 'Add Owner Adol Metamask 2')
    checkMinedRemoveOwnerTx(transactions[2], 'Remove Owner Adol Metamask 2')
    // checkThresholdTx(transactions[3], 'Change Threshold to 2', done)
  })
})
