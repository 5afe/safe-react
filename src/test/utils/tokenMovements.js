// @flow
import contract from 'truffle-contract'
import { getBalanceInEtherOf, getWeb3 } from '~/logic/wallets/getWeb3'
import Token from '#/test/TestToken.json'
import { ensureOnce } from '~/utils/singleton'
import { toNative } from '~/logic/wallets/tokens'

export const addEtherTo = async (address: string, eth: string) => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()
  const txData = { from: accounts[0], to: address, value: web3.utils.toWei(eth, 'ether') }
  return web3.eth.sendTransaction(txData)
}

export const checkBalanceOf = async (addressToTest: string, value: string) => {
  const safeBalance = await getBalanceInEtherOf(addressToTest)
  expect(safeBalance).toBe(value)
}

const createTokenContract = async (web3: any, executor: string) => {
  const token = contract(Token)
  token.setProvider(web3.currentProvider)

  return token.new({ from: executor, gas: '5000000' })
}

export const getFirstTokenContract = ensureOnce(createTokenContract)
export const getSecondTokenContract = ensureOnce(createTokenContract)

export const addTknTo = async (safe: string, value: number, tokenContract?: any) => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()

  const myToken = tokenContract || await getFirstTokenContract(web3, accounts[0])
  const nativeValue = await toNative(value, 18)
  await myToken.transfer(safe, nativeValue.valueOf(), { from: accounts[0], gas: '5000000' })

  return myToken.address
}
