// @flow
import { Map } from 'immutable'
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import * as fetchTokensAction from '~/routes/tokens/store/actions/fetchTokens'
import { checkMinedTx, checkPendingTx, EXPAND_BALANCE_INDEX } from '~/test/builder/safe.dom.utils'
import { whenExecuted } from '~/test/utils/logTransactions'
import SendToken from '~/routes/safe/component/SendToken'
import { makeToken, type Token } from '~/routes/tokens/store/model/token'
import addTokens from '~/routes/tokens/store/actions/addTokens'

export const sendMoveTokensForm = async (
  SafeDom: React$Component<any, any>,
  expandBalance: React$Component<any, any>,
  value: number,
  destination: string,
) => {
  TestUtils.Simulate.click(expandBalance)
  await sleep(500)

  // $FlowFixMe
  const balanceButtons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
  const tokenButton = balanceButtons[EXPAND_BALANCE_INDEX + 1] // expand button, and the next one is for sending
  expect(tokenButton.hasAttribute('disabled')).toBe(false)

  // load move tokens form component
  TestUtils.Simulate.click(tokenButton)
  await sleep(500)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const destinationInput = inputs[0]
  const amountofTokens = inputs[1]
  TestUtils.Simulate.change(amountofTokens, { target: { value } })
  TestUtils.Simulate.change(destinationInput, { target: { value: destination } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  return whenExecuted(SafeDom, SendToken)
}

export const dispatchTknBalance = async (store: Store, tokenAddress: string, address: string) => {
  const fetchBalancesMock = jest.spyOn(fetchTokensAction, 'fetchTokens')
  const funds = await fetchTokensAction.calculateBalanceOf(tokenAddress, address, 18)
  const balances: Map<string, Token> = Map().set('TKN', makeToken({
    address: tokenAddress,
    name: 'Token',
    symbol: 'TKN',
    decimals: 18,
    logoUri: 'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    funds,
  }))
  fetchBalancesMock.mockImplementation(() => store.dispatch(addTokens(address, balances)))
  await store.dispatch(fetchTokensAction.fetchTokens(address))
  fetchBalancesMock.mockRestore()
}

export const checkMinedMoveTokensTx = (Transaction: React$Component<any, any>, name: string) => {
  checkMinedTx(Transaction, name)
}

export const checkPendingMoveTokensTx = async (
  Transaction: React$Component<any, any>,
  safeThreshold: number,
  name: string,
  statusses: string[],
) => {
  await checkPendingTx(Transaction, safeThreshold, name, statusses)
}
