// @flow

import TestUtils from 'react-dom/test-utils'
import * as fetchBalancesAction from '~/routes/tokens/store/actions/fetchTokens'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { addTknTo, getFirstTokenContract } from '~/test/utils/tokenMovements'
import { EXPAND_BALANCE_INDEX, travelToSafe } from '~/test/builder/safe.dom.utils'
import { promisify } from '~/utils/promisify'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { sendMoveTokensForm, dispatchTknBalance } from '~/test/utils/transactions/moveTokens.helper'
import { sleep } from '~/utils/timer'

describe('DOM > Feature > SAFE ERC20 TOKENS', () => {
  let store
  let safeAddress: string
  let accounts
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
    accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  })

  it('sends ERC20 tokens', async () => {
    // GIVEN
    const numTokens = 100
    const tokenAddress = await addTknTo(safeAddress, numTokens)

    await dispatchTknBalance(store, tokenAddress, safeAddress)
    // const StandardToken = await fetchBalancesAction.getStandardTokenContract()
    // const myToken = await StandardToken.at(tokenAddress)
    // console.log(await myToken.allowance(safeAddress, accounts[2]))
    // console.log(await myToken.balanceOf(safeAddress))

    // WHEN
    const SafeDom = await travelToSafe(store, safeAddress)
    await sleep(800)
    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
    const expandBalance = buttons[EXPAND_BALANCE_INDEX]
    const receiver = accounts[2]
    await sendMoveTokensForm(SafeDom, expandBalance, 20, accounts[2])

    // THEN
    const safeFunds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(Number(safeFunds)).toBe(80)
    const receiverFunds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, receiver, 18)
    expect(Number(receiverFunds)).toBe(20)

    const token = await getFirstTokenContract(getWeb3(), accounts[0])
    const nativeSafeFunds = await token.balanceOf(safeAddress)
    expect(Number(nativeSafeFunds.valueOf())).toEqual(80 * (10 ** 18))
  })

  it('disables send token button when balance is 0', async () => {
    // GIVEN
    const token = await getFirstTokenContract(getWeb3(), accounts[0])
    await dispatchTknBalance(store, token.address, safeAddress)

    // WHEN
    const SafeDom = travelToSafe(store, safeAddress)

    // $FlowFixMe
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
    const expandBalance = buttons[EXPAND_BALANCE_INDEX]

    TestUtils.Simulate.click(expandBalance)
    await sleep(800)

    // $FlowFixMe
    const balanceButtons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
    const tokenButton = balanceButtons[EXPAND_BALANCE_INDEX + 1] // expand button, and the next one is for sending
    expect(tokenButton.hasAttribute('disabled')).toBe(true)
  })
})
