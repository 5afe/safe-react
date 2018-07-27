// @flow
import { getWeb3 } from '~/wallets/getWeb3'
import { BigNumber } from 'bignumber.js'

export const toNative = async (amt: string | number | BigNumber, decimal: number): Promise<BigNumber> => {
  const web3 = getWeb3()

  return web3.toBigNumber(amt).mul(10 ** decimal)
}
