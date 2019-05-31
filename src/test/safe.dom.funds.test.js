// @flow
import { render, fireEvent, cleanup } from '@testing-library/react'
import * as fetchBalancesAction from '~/logic/tokens/store/actions/fetchTokens'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { sendTokenTo, getFirstTokenContract } from '~/test/utils/tokenMovements'
import { EXPAND_BALANCE_INDEX, renderSafeView, createTestStore } from '~/test/builder/safe.dom.utils'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { sendMoveTokensForm, dispatchTknBalance } from '~/test/utils/transactions/moveTokens.helper'
import { sleep } from '~/utils/timer'

afterEach(cleanup)

describe('DOM > Feature > Funds', () => {
  let safeAddress: string
  let accounts
  beforeEach(async () => {
    safeAddress = await aMinedSafe(store)
    accounts = await getWeb3().eth.getAccounts()
  })

  it('Sends ETH', async () => {
    // GIVEN
    const numTokens = '100'
    const tokenAddress = await sendTokenTo(safeAddress, numTokens)
    const SafeDom = await renderSafeView(safeAddress)
    const { store } = SafeDom

    await dispatchTknBalance(store, tokenAddress, safeAddress)
    // const StandardToken = await fetchBalancesAction.getStandardTokenContract()
    // const myToken = await StandardToken.at(tokenAddress)
    // console.log(await myToken.allowance(safeAddress, accounts[2]))
    // console.log(await myToken.balanceOf(safeAddress))

    // WHEN
    await sleep(1500)
    console.log(SafeDom.history)
    const balanceRows = SafeDom.getAllByTestId('balance-row')
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
    expect(Number(nativeSafeFunds.valueOf())).toEqual(80 * 10 ** 18)
  })

  it('Sends Tokens', async () => {
    // GIVEN
    const numTokens = '100'
    const tokenAddress = await sendTokenTo(safeAddress, numTokens)

    await dispatchTknBalance(store, tokenAddress, safeAddress)
    // const StandardToken = await fetchBalancesAction.getStandardTokenContract()
    // const myToken = await StandardToken.at(tokenAddress)
    // console.log(await myToken.allowance(safeAddress, accounts[2]))
    // console.log(await myToken.balanceOf(safeAddress))

    // WHEN
    const SafeDom = await renderSafeView(store, safeAddress)
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
    expect(Number(nativeSafeFunds.valueOf())).toEqual(80 * 10 ** 18)
  })
})
