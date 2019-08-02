// @flow
import { BigNumber } from 'bignumber.js'
import Web3Integration from '~/logic/wallets/web3Integration'

export const toNative = (amt: string | number | BigNumber, decimal: number): BigNumber => {
  const { web3 } = Web3Integration

  return web3.utils.toBN(amt).mul(web3.utils.toBN(10 ** decimal))
}
