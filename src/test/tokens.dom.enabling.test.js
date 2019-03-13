// @flow
import * as TestUtils from 'react-dom/test-utils'
import { List } from 'immutable'
import { getWeb3 } from '~/logic/wallets/getWeb3'
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
import { getActiveTokenAddresses } from '~/utils/localStorage/tokens'
import { enableFirstToken, testToken } from '~/test/builder/tokens.dom.utils'
import * as fetchTokensModule from '~/routes/tokens/store/actions/fetchTokens'
import * as enhancedFetchModule from '~/utils/fetch'

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
    enhancedFetchModule.enhancedFetch = jest.fn()
    enhancedFetchModule.enhancedFetch.mockImplementation(() => Promise.resolve([
      {
        address: firstErc20Token.address,
        name: 'First Token Example',
        symbol: 'FTE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      },
      {
        address: secondErc20Token.address,
        name: 'Second Token Example',
        symbol: 'STE',
        decimals: 18,
        logoUri: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Earth_simple_icon.png',
      },
    ]))
  })

  it('retrieves only ether as active token in first moment', async () => {
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

    testToken(tokens[0].props.token, 'FTE', false)
    testToken(tokens[1].props.token, 'STE', false)
    testToken(tokens[2].props.token, 'ETH', true)

    const ethCheckbox = TestUtils.findRenderedComponentWithType(tokens[2], Checkbox)
    if (!ethCheckbox) throw new Error()
    expect(ethCheckbox.props.disabled).toBe(true)
  })

  it('fetch balances of only enabled tokens', async () => {
    // GIVEN
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    await addTknTo(safeAddress, 50, firstErc20Token)
    await addTknTo(safeAddress, 50, secondErc20Token)
    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))

    const match: Match = buildMathPropsFrom(safeAddress)
    let tokenList = tokenListSelector(store.getState(), { match })
    expect(tokenList.count()).toBe(3)

    await enableFirstToken(store, safeAddress)
    tokenList = tokenListSelector(store.getState(), { match })
    expect(tokenList.count()).toBe(3) // assuring the enableToken do not add extra info

    // THEN
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

  it('localStorage always returns a list', async () => {
    const store = aNewStore()
    const safeAddress = await aMinedSafe(store)
    let tokens: List<string> = getActiveTokenAddresses(safeAddress)
    expect(tokens).toEqual(List([]))

    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))
    tokens = getActiveTokenAddresses(safeAddress)
    expect(tokens.count()).toBe(0)

    await enableFirstToken(store, safeAddress)
    tokens = getActiveTokenAddresses(safeAddress)
    expect(tokens.count()).toBe(1)

    await store.dispatch(fetchTokensModule.fetchTokens(safeAddress))
    tokens = getActiveTokenAddresses(safeAddress)
    expect(tokens.count()).toBe(1)
  })
})
