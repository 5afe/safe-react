import abi from 'ethereumjs-abi'

import { CONTRACT_ERRORS, CONTRACT_ERROR_CODES } from 'src/logic/contracts/contracts.d'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import { GnosisSafe } from 'src/types/contracts/gnosis_safe.d'

export const decodeContractError = (contractError: string): string => {
  const code = CONTRACT_ERROR_CODES.find((code) => {
    return contractError.toUpperCase().includes(code.toUpperCase())
  })

  return code ? `${code}: ${CONTRACT_ERRORS[code]}` : contractError
}

export const getContractErrorMessage = async ({
  safeInstance,
  from,
  data,
}: {
  safeInstance: GnosisSafe
  from: string
  data: string
}): Promise<string | null> => {
  const web3 = getWeb3()

  try {
    const returnData = await web3.eth.call({
      to: safeInstance.options.address,
      from,
      value: 0,
      data,
    })

    const returnBuffer = Buffer.from(returnData.slice(2), 'hex')

    // Will throw if there was an error
    abi.rawDecode(['string'], returnBuffer.slice(4))[0]
  } catch (e) {
    return decodeContractError(e.message)
  }

  return null
}
