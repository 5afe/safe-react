// @flow
import { BALANCE_REDUCER_ID } from '~/routes/safe/store/reducer/balances'
import fetchBalance from '~/routes/safe/store/actions/fetchBalance'
import { aNewStore } from '~/store'
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import { aDeployedSafe } from './builder/deployedSafe.builder'

const addOneEtherTo = async (address: string) => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const txData = { from: accounts[0], to: address, value: web3.toWei('1', 'ether') }
  return promisify(cb => web3.eth.sendTransaction(txData, cb))
}

const balanceReducerTests = () => {
  describe('Safe Actions[fetchBalance]', () => {
    let store
    beforeEach(async () => {
      store = aNewStore()
    })

    it('reducer should return 0 to just deployed safe', async () => {
      // GIVEN
      const safeTx = await aDeployedSafe(store)
      const address = safeTx.contractAddress

      // WHEN
      await store.dispatch(fetchBalance(address))

      // THEN
      const balances = store.getState()[BALANCE_REDUCER_ID]
      expect(balances).not.toBe(undefined)
      expect(balances.get(address)).toBe('0')
    })

    it('reducer should return 1 ETH as funds to safe with 1 ETH', async () => {
      // GIVEN
      const safeTx = await aDeployedSafe(store)
      const address = safeTx.contractAddress

      // WHEN
      await addOneEtherTo(address)
      await store.dispatch(fetchBalance(address))

      // THEN
      const balances = store.getState()[BALANCE_REDUCER_ID]
      expect(balances).not.toBe(undefined)
      expect(balances.get(address)).toBe('1')
    })
  })
}

export default balanceReducerTests
