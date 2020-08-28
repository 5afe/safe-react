// 
import { fireEvent, waitForElement } from '@testing-library/react'
import { aNewStore } from 'src/store'
import { aMinedSafe } from 'src/test/builder/safe.redux.builder'
import { sendEtherTo } from 'src/test/utils/tokenMovements'
import { renderSafeView } from 'src/test/builder/safe.dom.utils'
import { getWeb3, getBalanceInEtherOf } from 'src/logic/wallets/getWeb3'
import { sleep } from 'src/utils/timer'
import '@testing-library/jest-dom/extend-expect'
import { BALANCE_ROW_TEST_ID } from 'src/routes/safe/components/Balances'
import { fillAndSubmitSendFundsForm } from './utils/transactions'
import { TRANSACTIONS_TAB_BTN_TEST_ID } from 'src/routes/safe/container'
import { TRANSACTION_ROW_TEST_ID } from 'src/routes/safe/components/Transactions/TxsTable'
import { useTestAccountAt, resetTestAccount } from './utils/accounts'
//import { CONFIRM_TX_BTN_TEST_ID } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/OwnersColumn/ButtonRow'
import { APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/ApproveTxModal'

afterEach(resetTestAccount)

describe('DOM > Feature > Sending Funds', () => {
  let store
  let safeAddress
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    // using 4th account because other accounts were used in other tests and paid gas
    safeAddress = await aMinedSafe(store, 2, 2)
    accounts = await getWeb3().eth.getAccounts()
  })

  it('Sends ETH with threshold = 2', async () => {
    // GIVEN
    const ethAmount = '5'
    await sendEtherTo(safeAddress, ethAmount)
    const balanceAfterSendingEthToSafe = await getBalanceInEtherOf(accounts[0])

    // WHEN
    const SafeDom = renderSafeView(store, safeAddress)
    await sleep(1300)

    // Open send funds modal
    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows[0]).toHaveTextContent(`${ethAmount} ETH`)
    const sendButton = SafeDom.getByTestId('balance-send-btn')
    fireEvent.click(sendButton)

    await fillAndSubmitSendFundsForm(SafeDom, sendButton, ethAmount, accounts[0])

    // CONFIRM TX
    fireEvent.click(SafeDom.getByTestId(TRANSACTIONS_TAB_BTN_TEST_ID))
    await sleep(200)

    useTestAccountAt(1)
    await sleep(2200)
    const txRows = SafeDom.getAllByTestId(TRANSACTION_ROW_TEST_ID)
    expect(txRows.length).toBe(1)

    fireEvent.click(txRows[0])

    //const confirmBtn = await waitForElement(() => SafeDom.getByTestId(CONFIRM_TX_BTN_TEST_ID))
    //fireEvent.click(confirmBtn)

    // Travel confirm modal
    const approveTxBtn = await waitForElement(() => SafeDom.getByTestId(APPROVE_TX_MODAL_SUBMIT_BTN_TEST_ID))
    fireEvent.click(approveTxBtn)

    await sleep(1000)

    // THEN
    const safeFunds = await getBalanceInEtherOf(safeAddress)
    expect(Number(safeFunds)).toBe(0)

    const receiverFunds = await getBalanceInEtherOf(accounts[0])
    const ESTIMATED_GASCOSTS = 0.3
    expect(Number(parseInt(receiverFunds, 10) - parseInt(balanceAfterSendingEthToSafe, 10))).toBeGreaterThan(
      parseInt(ethAmount, 10) - ESTIMATED_GASCOSTS,
    )
  })
})
