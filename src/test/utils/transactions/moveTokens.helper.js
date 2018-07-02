// @flow
import { Map } from 'immutable'
import TestUtils from 'react-dom/test-utils'
import { sleep } from '~/utils/timer'
import * as fetchBalancesAction from '~/routes/safe/store/actions/fetchBalances'
import { checkMinedTx, checkPendingTx, EXPAND_BALANCE_INDEX } from '~/test/builder/safe.dom.utils'
import { makeBalance, type Balance } from '~/routes/safe/store/model/balance'
import addBalances from '~/routes/safe/store/actions/addBalances'

export const sendMoveTokensForm = async (
  SafeDom: React$Component<any, any>,
  expandBalance: React$Component<any, any>,
  txName: string,
  value: number,
  destination: string,
) => {
  TestUtils.Simulate.click(expandBalance)
  await sleep(800)

  // $FlowFixMe
  const balanceButtons = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'button')
  const tokenButton = balanceButtons[EXPAND_BALANCE_INDEX + 1] // expand button, and the next one is for sending
  expect(tokenButton.hasAttribute('disabled')).toBe(false)

  // load move tokens form component
  TestUtils.Simulate.click(tokenButton)
  await sleep(800)

  // fill the form
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SafeDom, 'input')
  const nameInput = inputs[0]
  const destinationInput = inputs[1]
  const amountofTokens = inputs[2]
  TestUtils.Simulate.change(nameInput, { target: { value: txName } })
  TestUtils.Simulate.change(amountofTokens, { target: { value } })
  TestUtils.Simulate.change(destinationInput, { target: { value: destination } })
  // $FlowFixMe
  const form = TestUtils.findRenderedDOMComponentWithTag(SafeDom, 'form')

  // submit it
  TestUtils.Simulate.submit(form)
  TestUtils.Simulate.submit(form)

  // give time to process transaction
  return sleep(1250)
}

export const dispatchTknBalance = async (store: Store, tokenAddress: string, address: string) => {
  const fetchBalancesMock = jest.spyOn(fetchBalancesAction, 'fetchBalances')
  const funds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, address)

  const balances: Map<string, Balance> = Map().set('TKN', makeBalance({
    address: tokenAddress,
    name: 'Token',
    symbol: 'TKN',
    decimals: 18,
    logoUrl: 'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
    funds,
  }))
  fetchBalancesMock.mockImplementation(() => store.dispatch(addBalances(address, balances)))
  await store.dispatch(fetchBalancesAction.fetchBalances(address))
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
