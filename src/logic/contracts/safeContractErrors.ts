import abi from 'ethereumjs-abi'

import { CONTRACT_ERRORS, CONTRACT_ERROR_CODES } from 'src/logic/contracts/contracts.d'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

export const getContractError = async (to: string, value: number, data: string, from: string): Promise<string> => {
  const web3 = getWeb3()
  const returnData = await web3.eth.call({
    to,
    from,
    value,
    data,
  })
  const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

  return abi.rawDecode(['string'], returnBuffer.slice(4))[0]
}

export const decodeContractError = (error: string): string => {
  const code = CONTRACT_ERROR_CODES.find((code) => {
    return error.toUpperCase().includes(code.toUpperCase())
  })

  return code ? `${code}:${CONTRACT_ERRORS[code]}` : error
}
