// @flow
import { List } from 'immutable'
import { getWeb3 } from '~/logic/wallets/getWeb3'
import { type Token } from '~/logic/tokens/store/model/token'
import { sameAddress } from '~/logic/wallets/ethAddresses'
// import { getStandardTokenContract } from '~/logic/tokens/store/actions/fetchTokens'

export const simpleMemoize = (fn: Function) => {
  let lastArg
  let lastResult
  return (arg: any) => {
    if (arg !== lastArg) {
      lastArg = arg
      lastResult = fn(arg)
    }
    return lastResult
  }
}

// eslint-disable-next-line
export const addressIsTokenContract = simpleMemoize(async (tokenAddress: string) => {
  // SECOND APPROACH:
  // They both seem to work the same
  // const tokenContract = await getStandardTokenContract()
  // try {
  //   await tokenContract.at(tokenAddress)
  // } catch {
  //   return 'Not a token address'
  // }

  const web3 = getWeb3()
  const call = await web3.eth.call({ to: tokenAddress, data: web3.utils.sha3('totalSupply()') })

  if (call === '0x') {
    return 'Not a token address'
  }
})

// eslint-disable-next-line
export const doesntExistInTokenList = (tokenList: List<Token>) => simpleMemoize((tokenAddress: string) => {
  const tokenIndex = tokenList.findIndex(({ address }) => sameAddress(address, tokenAddress))

  if (tokenIndex !== -1) {
    return 'Token already exists in your token list'
  }
})
