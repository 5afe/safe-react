//import contract from '@truffle/contract'
import { getBalanceInEtherOf, getWeb3 } from 'src/logic/wallets/getWeb3'
//import { ensureOnce } from 'src/utils/singleton'
import { toNative } from 'src/logic/wallets/tokens'
//import TokenOMG from '../../../build/contracts/TokenOMG'
//import TokenRDN from '../../../build/contracts/TokenRDN'
//import Token6Decimals from '../../../build/contracts/Token6Decimals.json'

export const sendEtherTo = async (address, eth, fromAccountIndex = 0) => {
  const web3 = getWeb3()
  const accounts = await web3.eth.getAccounts()
  const { toBN, toWei } = web3.utils
  const txData = { from: accounts[fromAccountIndex], to: address, value: toBN(toWei(eth, 'ether')as any)  }
  return web3.eth.sendTransaction(txData)
}

export const checkBalanceOf = async (addressToTest, value) => {
  const safeBalance = await getBalanceInEtherOf(addressToTest)
  expect(safeBalance).toBe(value)
}

// const createTokenOMGContract = async (web3, creator) => {
//   const token = contract(TokenOMG)
//   const { toBN } = web3.utils
//   const amount = toBN(50000)
//     .mul(toBN(10).pow(toBN(18)))
//     .toString()
//   token.setProvider(web3.currentProvider)

//   return token.new(amount, { from: creator })
// }

// const createTokenRDNContract = async (web3, creator) => {
//   const token = contract(TokenRDN)
//   const { toBN } = web3.utils
//   const amount = toBN(50000)
//     .mul(toBN(10).pow(toBN(18)))
//     .toString()
//   token.setProvider(web3.currentProvider)

//   return token.new(amount, { from: creator })
// }

// const create6DecimalsTokenContract = async (web3, creator) => {
//   const token = contract(Token6Decimals)
//   const { toBN } = web3.utils
//   const amount = toBN(50000)
//     .mul(toBN(10).pow(toBN(6)))
//     .toString()
//   token.setProvider(web3.currentProvider)

//   return token.new(amount, { from: creator })
// }

export const getFirstTokenContract = undefined //ensureOnce(createTokenOMGContract)
export const getSecondTokenContract = undefined //ensureOnce(createTokenRDNContract)
export const get6DecimalsTokenContract = undefined //ensureOnce(create6DecimalsTokenContract)

// export const sendTokenTo = async (safe, value, tokenContract?: any) => {
//   const web3 = getWeb3()
//   const accounts = await web3.eth.getAccounts()

//   const OMGToken = tokenContract || (await getFirstTokenContract(web3, accounts[0]))
//   const nativeValue = toNative(value, 18)
//   await OMGToken.transfer(safe, nativeValue.valueOf(), { from: accounts[0], gas: '5000000' })

//   return OMGToken.address
// }
