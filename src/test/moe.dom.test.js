// @flow
import TestUtils from 'react-dom/test-utils'
import Transaction from '~/routes/safe/component/Transactions/Transaction'
import { listTxsClickingOn, LIST_TXS_INDEX, EXPAND_OWNERS_INDEX, refreshTransactions } from '~/test/builder/safe.dom.utils'
import { renderSafeInDom, type DomSafe } from '~/test/builder/safe.dom.builder'
import { sendRemoveOwnerForm, checkMinedRemoveOwnerTx, checkPendingRemoveOwnerTx } from '~/test/utils/transactions/removeOwner.helper'
import { processTransaction } from '~/routes/safe/component/Transactions/processTransactions'
import { sleep } from '~/utils/timer'
import { getGnosisSafeInstanceAt } from '~/wallets/safeContracts'
import { checkThresholdOf } from '~/test/utils/transactions/threshold.helper'

const printOutApprove = async (subject: string, address: string, owners: string[], data, nonce) => {
  // eslint-disable-next-line
  console.log(subject)

  const gnosisSafe = await getGnosisSafeInstanceAt(address)
  const transactionHash = await gnosisSafe.getTransactionHash(address, 0, data, 0, nonce)
  // eslint-disable-next-line
  console.log(`EO transaction hash ${transactionHash}`)

  await Promise.all(owners.map(async (owner, index) => {
    const approved = await gnosisSafe.isApproved(transactionHash, owner)
    // eslint-disable-next-line
    console.log(`EO transaction approved by owner index ${index}: ${approved}`)
  }))
  // eslint-disable-next-line
  console.log(`EO transaction executed ${await gnosisSafe.isExecuted(transactionHash)}`)
}

describe('DOM > Feature > SAFE MULTISIG TX 1 Owner 1 Threshold', () => {
  let domSafe: DomSafe
  it('mines correctly all multisig txs in a 1 owner & 1 threshold safe', async () => {
    // GIVEN one safe with 1 owner and 1 threshold
    const owners = 3
    const threshold = 3
    domSafe = await renderSafeInDom(owners, threshold)
    const {
      address, safe: SafeDom, safeButtons, accounts, store,
    } = domSafe

    const gnosisSafe = await getGnosisSafeInstanceAt(address)
    const ownersInvolved = [accounts[0], accounts[1], accounts[2]]
    console.log('EO: Preparing party')
    console.log(`    EO: owner 0 --> ${accounts[0]}`)
    console.log(`    EO: owner 1 --> ${accounts[1]}`)
    console.log(`    EO: owner 2 --> ${accounts[2]}`)
    console.log(`    EO: owners stored in safe --> ${await gnosisSafe.getOwners()}`)
    console.log(`    EO: threshold stored in safe --> ${await gnosisSafe.getThreshold()}`)
    console.log('EO: Party starts here')

    // WHEN
    await checkThresholdOf(address, 3)
    await sendRemoveOwnerForm(SafeDom, safeButtons[EXPAND_OWNERS_INDEX])
    await sleep(3000)
    await listTxsClickingOn(safeButtons[LIST_TXS_INDEX])
    let transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    expect(transactions.length).toBe(1)
    const removeTx = transactions[0]
    let statusses = ['Adolfo 3 Eth Account [Not confirmed]', 'Adolfo 2 Eth Account [Not confirmed]', 'Adolfo 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(removeTx, 3, 'Remove Owner Adolfo 3 Eth Account', statusses)
    await printOutApprove('Confirmed by accounts[0]', address, ownersInvolved, removeTx.props.transaction.get('data'), removeTx.props.transaction.get('nonce'))

    // THEN
    await processTransaction(address, removeTx.props.transaction, 1, accounts[1])
    await refreshTransactions(store)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    statusses = ['Adolfo 3 Eth Account [Not confirmed]', 'Adolfo 2 Eth Account [Confirmed]', 'Adolfo 1 Eth Account [Confirmed]']
    await checkPendingRemoveOwnerTx(transactions[0], 2, 'Remove Owner Adolfo 3 Eth Account', statusses)
    await checkThresholdOf(address, 3)
    await printOutApprove('Confirmed by accounts[1]', address, ownersInvolved, transactions[0].props.transaction.get('data'), transactions[0].props.transaction.get('nonce'))

    console.log("BEFOOOOOOORE")
    await processTransaction(address, removeTx.props.transaction, 2, accounts[2])
    await refreshTransactions(store)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await printOutApprove('Executed by accounts[2]', address, ownersInvolved, transactions[0].props.transaction.get('data'), transactions[0].props.transaction.get('nonce'))


    await checkThresholdOf(address, 2)
    transactions = TestUtils.scryRenderedComponentsWithType(SafeDom, Transaction)
    await checkMinedRemoveOwnerTx(transactions[0], 'Remove Owner')
  })
})
