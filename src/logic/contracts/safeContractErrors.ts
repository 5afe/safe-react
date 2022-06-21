import abi from 'ethereumjs-abi'

import { CONTRACT_ERRORS, CONTRACT_ERROR_CODES } from 'src/logic/contracts/contracts.d'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'
import { logError, Errors } from '../exceptions/CodedException'

const GENERIC_FAILED_TX_MSG = 'unable to decode contract error message'

export const decodeMessage = (message: string): string | null => {
  const code = CONTRACT_ERROR_CODES.find((code) => {
    return message.toUpperCase().includes(code.toUpperCase())
  })

  return code ? `${code}: ${CONTRACT_ERRORS[code]}` : null
}

export const getContractErrorMessage = async ({
  safeInstance,
  from,
  data,
}: {
  safeInstance: GnosisSafe
  from: string
  data: string
}): Promise<string | undefined> => {
  const web3 = getWeb3()

  try {
    const returnData = await web3.eth.call({
      to: safeInstance.options.address,
      from,
      value: 0,
      data,
    })

    const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

    const contractOutput = abi.rawDecode(['string'], returnBuffer.slice(4))[0]
    return decodeMessage(contractOutput) || contractOutput
  } catch (err) {
    logError(Errors._817, err.message)
    return GENERIC_FAILED_TX_MSG
  }
}
