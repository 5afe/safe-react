import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const toNative = (amt, decimal) => {
  const web3 = getWeb3()

  return web3.utils.toBN(amt).mul(web3.utils.toBN(10 ** decimal))
}
