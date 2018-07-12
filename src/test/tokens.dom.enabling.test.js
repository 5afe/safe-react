// @flow
import * as TestUtils from 'react-dom/test-utils'
import { getWeb3 } from '~/wallets/getWeb3'
import { type Match } from 'react-router-dom'
import { promisify } from '~/utils/promisify'
import TokenComponent from '~/routes/tokens/component/Token'
import Checkbox from '@material-ui/core/Checkbox'
import { getFirstTokenContract, getSecondTokenContract, addTknTo } from '~/test/utils/tokenMovements'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { travelToTokens } from '~/test/builder/safe.dom.utils'
import { sleep } from '~/utils/timer'
import { buildMathPropsFrom } from '~/test/utils/buildReactRouterProps'
import { tokenListSelector, activeTokensSelector } from '~/routes/tokens/store/selectors'
import { type Token } from '~/routes/tokens/store/model/token'

const fetchTokensModule = require('../routes/tokens/store/actions/fetchTokens')

// $FlowFixMe
fetchTokensModule.fetchTokensData = jest.fn()

describe('DOM > Feature > Enable and disable default tokens', () => {
  let web3
  let accounts
  let firstErc20Token
  let secondErc20Token

  beforeAll(async () => {
    web3 = getWeb3()
    accounts = await promisify(cb => web3.eth.getAccounts(cb))
    firstErc20Token = await getFirstTokenContract(web3, accounts[0])
    secondErc20Token = await getSecondTokenContract(web3, accounts[0])
    // $FlowFixMe
    fetchTokensModule.fetchTokensData.mockImplementation(() => Promise.resolve([
      {
        address: firstErc20Token.address,
        name: 'First Token Example',
        symbol: 'FTE',
        decimals: 18,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      },
      {
        address: secondErc20Token.address,
        name: 'Second Token Example',
        symbol: 'STE',
        decimals: 18,
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      },
    ]))
  })

  it('retrieves only ether as active token', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))

    // WHEN
    const TokensDom = await travelToTokens(store, safeAddress)
    await sleep(400)

    // THEN
    const tokens = TestUtils.scryRenderedComponentsWithType(TokensDom, TokenComponent)
    expect(tokens.length).toBe(3)

    const firstToken = tokens[0]
    expect(firstToken.props.token.get('symbol')).toBe('FTE')
    expect(firstToken.props.token.get('status')).toBe(false)

    const secontToken = tokens[1]
    expect(secontToken.props.token.get('symbol')).toBe('STE')
    expect(secontToken.props.token.get('status')).toBe(false)

    const etherToken = tokens[2]
    expect(etherToken.props.token.get('symbol')).toBe('ETH')
    expect(etherToken.props.token.get('status')).toBe(true)

    const ethCheckbox = TestUtils.findRenderedComponentWithType(etherToken, Checkbox)
    if (!ethCheckbox) throw new Error()
    expect(ethCheckbox.props.disabled).toBe(true)
  })

  const testToken = (token: Token | typeof undefined, symbol: string, status: boolean, funds?: string) => {
    if (!token) throw new Error()
    expect(token.get('symbol')).toBe(symbol)
    expect(token.get('status')).toBe(status)
    if (funds) {
      expect(token.get('funds')).toBe(funds)
    }
  }

  it('fetch balances of only enabled tokens', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await addTknTo(safeAddress, 50, firstErc20Token)
    await addTknTo(safeAddress, 50, secondErc20Token)
    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))
    const TokensDom = await travelToTokens(store, safeAddress)
    await sleep(400)

    // WHEN
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TokensDom, 'input')

    const ethTokenInput = inputs[2]
    expect(ethTokenInput.hasAttribute('disabled')).toBe(true)
    const firstTokenInput = inputs[0]
    expect(firstTokenInput.hasAttribute('disabled')).toBe(false)
    TestUtils.Simulate.change(firstTokenInput, { target: { checked: 'true' } })

    // THEN
    const match: Match = buildMathPropsFrom(safeAddress)
    const tokenList = tokenListSelector(store.getState(), { match })

    testToken(tokenList.get(0), 'FTE', true)
    testToken(tokenList.get(1), 'STE', false)
    testToken(tokenList.get(2), 'ETH', true)

    const activeTokenList = activeTokensSelector(store.getState(), { match })
    expect(activeTokenList.count()).toBe(2)

    testToken(activeTokenList.get(0), 'FTE', true)
    testToken(activeTokenList.get(1), 'ETH', true)

    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))

    const fundedTokenList = tokenListSelector(store.getState(), { match })
    expect(fundedTokenList.count()).toBe(3)

    testToken(fundedTokenList.get(0), 'FTE', true, '50')
    testToken(fundedTokenList.get(1), 'STE', false, '0')
    testToken(fundedTokenList.get(2), 'ETH', true, '0')
  })
})
