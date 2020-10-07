import { getWeb3 } from 'src/config'

export const toNative = (amt, decimal) => {
  const web3 = getWeb3()

  return web3.utils.toBN(amt).mul(web3.utils.toBN(10 ** decimal))
}
