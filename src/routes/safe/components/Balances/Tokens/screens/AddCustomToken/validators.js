// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'

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
  const web3 = getWeb3()
  const call = await web3.eth.call({ to: tokenAddress, data: web3.utils.sha3('totalSupply()') })

  if (call === '0x') {
    return 'Not a token address'
  }
})
