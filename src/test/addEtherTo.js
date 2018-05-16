// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'

export const addEtherTo = async (address: string, eth: string) => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const txData = { from: accounts[0], to: address, value: web3.toWei(eth, 'ether') }
  return promisify(cb => web3.eth.sendTransaction(txData, cb))
}
