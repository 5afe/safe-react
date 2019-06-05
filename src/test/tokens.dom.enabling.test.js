// @flow
import { List } from 'immutable'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import Checkbox from '@material-ui/core/Checkbox'
import { getFirstTokenContract, getSecondTokenContract } from '~/test/utils/tokenMovements'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import { testToken } from '~/test/builder/tokens.dom.utils'
import saveTokens from '~/logic/tokens/store/actions/saveTokens'
import { clickOnManageTokens, toggleToken } from './utils/DOMNavigation'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'
import { makeToken } from '~/logic/tokens/store/model/token'

describe('DOM > Feature > Enable and disable default tokens', () => {
  let web3
  let accounts
  let firstErc20Token
  let secondErc20Token
  let tokens

  beforeAll(async () => {
    web3 = getWeb3()
    accounts = await web3.eth.getAccounts()

    firstErc20Token = await getFirstTokenContract(web3, accounts[0])
    secondErc20Token = await getSecondTokenContract(web3, accounts[0])
    tokens = List([
      makeToken({
        address: firstErc20Token.address,
        name: 'First Token Example',
        symbol: 'FTE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      }),
      makeToken({
        address: secondErc20Token.address,
        name: 'Second Token Example',
        symbol: 'STE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      }),
    ])
  })

  it('allows to enable and disable tokens', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await store.dispatch(saveTokens(tokens))

    // WHEN
    const TokensDom = await renderSafeView(store, safeAddress)
    await sleep(400)

    // Check if only ETH is enabled
    TokensDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    console.log(store.getState().tokens.toJS())

    // THEN
    clickOnManageTokens(TokensDom)
    toggleToken(TokensDom, 'FTE', firstErc20Token.address)
    toggleToken(TokensDom, 'STE', secondErc20Token.address)

    const tokens = TestUtils.scryRenderedComponentsWithType(TokensDom, TokenComponent)
    expect(tokens.length).toBe(3)

    testToken(tokens[0].props.token, 'FTE', false)
    testToken(tokens[1].props.token, 'STE', false)
    testToken(tokens[2].props.token, 'ETH', true)

    const ethCheckbox = TestUtils.findRenderedComponentWithType(tokens[2], Checkbox)
    if (!ethCheckbox) throw new Error()
    expect(ethCheckbox.props.disabled).toBe(true)
  })
})
