// @flow
import contract from 'truffle-contract'
import { getProviderInfo, getBalanceInEtherOf, getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import withdraw, { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdraw/withdraw'
import { type Safe } from '~/routes/safe/store/model/safe'
import Token from '#/test/Token.json'

export const addEtherTo = async (address: string, eth: string) => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => web3.eth.getAccounts(cb))
  const txData = { from: accounts[0], to: address, value: web3.toWei(eth, 'ether') }
  return promisify(cb => web3.eth.sendTransaction(txData, cb))
}

export const executeWithdrawOn = async (safe: Safe, value: number) => {
  const providerInfo = await getProviderInfo()
  const userAddress = providerInfo.account

  const values = {
    [DESTINATION_PARAM]: userAddress,
    [VALUE_PARAM]: `${value}`,
  }

  return withdraw(values, safe, userAddress)
}

export const checkBalanceOf = async (addressToTest: string, value: string) => {
  const safeBalance = await getBalanceInEtherOf(addressToTest)
  expect(safeBalance).toBe(value)
}

export const addTknTo = async (safe: string, value: number) => {
  const web3 = getWeb3()
  const token = contract(Token)
  token.setProvider(web3.currentProvider)
  const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))
  const myToken = await token.new({ from: accounts[0], gas: '5000000' })
  await myToken.transfer(safe, value, { from: accounts[0], gas: '5000000' })

  return myToken.address
}
