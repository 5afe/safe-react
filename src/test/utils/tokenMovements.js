// @flow
import contract from 'truffle-contract'
import { getProviderInfo, getBalanceInEtherOf, getWeb3 } from '~/wallets/getWeb3'
import { promisify } from '~/utils/promisify'
import withdraw, { DESTINATION_PARAM, VALUE_PARAM } from '~/routes/safe/component/Withdraw/withdraw'
import { type Safe } from '~/routes/safe/store/model/safe'
import Token from '#/test/FixedSupplyToken.json'
import { ensureOnce } from '~/utils/singleton'
import { toNative } from '~/wallets/tokens'

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

const createTokenContract = async (web3: any, executor: string) => {
  const token = contract(Token)
  token.setProvider(web3.currentProvider)

  return token.new({ from: executor, gas: '5000000' })
}

export const getFirstTokenContract = ensureOnce(createTokenContract)
export const getSecondTokenContract = ensureOnce(createTokenContract)

export const addTknTo = async (safe: string, value: number, tokenContract?: any) => {
  const web3 = getWeb3()
  const accounts = await promisify(cb => getWeb3().eth.getAccounts(cb))

  const myToken = tokenContract || await getFirstTokenContract(web3, accounts[0])
  const nativeValue = await toNative(value, 18)
  await myToken.transfer(safe, nativeValue.valueOf(), { from: accounts[0], gas: '5000000' })

  return myToken.address
}
