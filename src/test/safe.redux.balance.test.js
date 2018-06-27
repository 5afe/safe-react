// @flow
import contract from 'truffle-contract'
import { Map } from 'immutable'
import { BALANCE_REDUCER_ID } from '~/routes/safe/store/reducer/balances'
import fetchBalances from '~/routes/safe/store/actions/fetchBalances'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { type Balance } from '~/routes/safe/store/model/balance'
import { addEtherTo } from '~/test/utils/etherMovements'
import Token from '#/test/Token.json'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'

describe('Safe Actions[fetchBalance]', () => {
  let store
  let address: string
  beforeEach(async () => {
    store = aNewStore()
    address = await aMinedSafe(store)
  })

  it('reducer should return 0 to just deployed safe', async () => {
    // GIVEN
    const tokenList = ['WE', '<3', 'GNO', 'OMG', 'RDN']

    // WHEN
    await store.dispatch(fetchBalances(address))

    // THEN
    const balances: Map<string, Map<string, Balance>> | typeof undefined = store.getState()[BALANCE_REDUCER_ID]
    if (!balances) throw new Error()

    const safeBalances: Map<string, Balance> | typeof undefined = balances.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(6)

    tokenList.forEach((token: string) => {
      const record = safeBalances.get(token)
      if (!record) throw new Error()
      expect(record.get('funds')).toBe('0')
    })
  })

  it('reducer should return 0.03456 ETH as funds to safe with 0.03456 ETH', async () => {
    // WHEN
    await addEtherTo(address, '0.03456')
    await store.dispatch(fetchBalances(address))

    // THEN
    const balances: Map<string, Map<string, Balance>> | typeof undefined = store.getState()[BALANCE_REDUCER_ID]
    if (!balances) throw new Error()

    const safeBalances: Map<string, Balance> | typeof undefined = balances.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(6)

    const ethBalance = safeBalances.get('ETH')
    if (!ethBalance) throw new Error()
    expect(ethBalance.get('funds')).toBe('0.03456')
  })

  it('reducer should return 2 GNO when safe has 2 GNO', async () => {
    // GIVEN
    const web3 = getWeb3()
    const token = contract(Token)
    token.setProvider(web3.currentProvider)
    const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
    const myToken = await token.new({ from: accounts[0], gas: '5000000' })
    await myToken.transfer(address, 100, { from: accounts[0], gas: '5000000' })

    // console.log(await myToken.totalSupply())
    // WHEN
    await store.dispatch(fetchBalances(address))

    // THEN
    const balances: Map<string, Map<string, Balance>> | typeof undefined = store.getState()[BALANCE_REDUCER_ID]
    if (!balances) throw new Error()

    const safeBalances: Map<string, Balance> | typeof undefined = balances.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(6)

    const ethBalance = safeBalances.get('ETH')
    if (!ethBalance) throw new Error()
    expect(ethBalance.get('funds')).toBe('0.03456')
  })
})
