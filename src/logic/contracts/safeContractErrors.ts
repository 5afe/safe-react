import abi from 'ethereumjs-abi'
import { CONTRACT_ERRORS, CONTRACT_ERROR_CODES } from 'src/logic/contracts/contracts.d'

export const _decodeErrorMessage = (message: string): string => {
  const code = CONTRACT_ERROR_CODES.find((code) => {
    return message.toUpperCase().includes(code.toUpperCase())
  })
  return code ? `${code}: ${CONTRACT_ERRORS[code]}` : message
}

export const parseContractError = (contractResponse: string | Error): string => {
  if (contractResponse instanceof Error) {
    return _decodeErrorMessage(contractResponse.message)
  }

  const returnBuffer = Buffer.from(contractResponse.slice(2), 'hex')
  const contractOutput = abi.rawDecode(['string'], returnBuffer.slice(4))[0]
  return _decodeErrorMessage(contractOutput)
}
