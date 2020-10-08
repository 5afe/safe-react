// 
import abi from 'ethereumjs-abi'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const getErrorMessage = async (to, value, data, from) => {
  const web3 = getWeb3()
  const returnData: any = await web3.eth.call({
    to,
    from,
    value,
    data,
  })
  const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

  return abi.rawDecode(['string'], returnBuffer.slice(4))[0]
}
