// @flow
import { getWeb3 } from '~/logic/wallets/getWeb3'
import abi from 'ethereumjs-abi'
import { promisify } from '~/utils/promisify'

export const getErrorMessage = async (to: string, value: number, data: string, from: string) => {
  const web3 = getWeb3()
  const returnData = await promisify(cb => web3.eth.call({
    to, from, value, data,
  }, cb))
  const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

  return abi.rawDecode(['string'], returnBuffer.slice(4))[0]
}
