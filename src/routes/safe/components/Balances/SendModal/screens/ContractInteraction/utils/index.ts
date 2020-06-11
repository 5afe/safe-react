import { FORM_ERROR, Mutator, SubmissionErrors } from 'final-form'
import createDecorator from 'final-form-calculate'
import { ContractSendMethod } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/contractInteraction/sources'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { getAddressFromENS, getWeb3 } from 'src/logic/wallets/getWeb3'
import { TransactionReviewType } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/Review'
import { isValidEnsName } from 'src/logic/wallets/ethAddresses'

export const NO_CONTRACT = 'no contract'

export const abiExtractor = createDecorator({
  field: 'contractAddress',
  updates: {
    abi: async (contractAddress) => {
      if (
        !contractAddress ||
        mustBeEthereumAddress(contractAddress) ||
        (await mustBeEthereumContractAddress(contractAddress))
      ) {
        return
      }
      const network = getNetwork()
      const source = getConfiguredSource()
      return source.getContractABI(contractAddress, network)
    },
  },
})

export const ensResolver = createDecorator({
  field: 'contractAddress',
  updates: {
    contractAddress: async (contractAddress) => {
      try {
        const resolvedAddress = isValidEnsName(contractAddress) && (await getAddressFromENS(contractAddress))

        if (resolvedAddress) {
          return resolvedAddress
        }
      } catch (e) {
        console.error(e.message)
        return contractAddress
      }

      return contractAddress
    },
  },
})

export const formMutators: Record<string, Mutator<{ selectedMethod: { name: string } }>> = {
  setMax: (args, state, utils) => {
    utils.changeValue(state, 'value', () => args[0])
  },
  setContractAddress: (args, state, utils) => {
    utils.changeValue(state, 'contractAddress', () => args[0])
  },
  setSelectedMethod: (args, state, utils) => {
    const modified =
      state.lastFormState.values.selectedMethod && state.lastFormState.values.selectedMethod.name !== args[0].name

    if (modified) {
      utils.changeValue(state, 'callResults', () => '')
      utils.changeValue(state, 'value', () => '')
    }

    utils.changeValue(state, 'selectedMethod', () => args[0])
  },
  setCallResults: (args, state, utils) => {
    utils.changeValue(state, 'callResults', () => args[0])
  },
}

export const isAddress = (type: string): boolean => type.indexOf('address') === 0
export const isBoolean = (type: string): boolean => type.indexOf('bool') === 0
export const isString = (type: string): boolean => type.indexOf('string') === 0
export const isUint = (type: string): boolean => type.indexOf('uint') === 0
export const isInt = (type: string): boolean => type.indexOf('int') === 0
export const isByte = (type: string): boolean => type.indexOf('byte') === 0

export const isNotStringType = (item: string): boolean => typeof item !== 'string'
export const isNotBooleanType = (item: string): boolean => typeof item !== 'boolean'
export const isNotNumberType = (item: string): boolean => !Number.isInteger(item)

export const isArrayParameter = (parameter: string): boolean => /\[]$/.test(parameter)

export const handleSubmitError = (error: SubmissionErrors, values: Record<string, string>): Record<string, string> => {
  for (const key in values) {
    if (values.hasOwnProperty(key) && values[key] === error.value) {
      return { [key]: error.reason }
    }
  }

  // .call() failed and we're logging a generic error
  return { [FORM_ERROR]: error.message }
}

const extractMethodArgs = (methodName: string, values: Record<string, string>) => ({ type }, index) => {
  const key = `methodInput-${methodName}_${index}_${type}`

  if (isArrayParameter(type)) {
    // react-final-form removes the `[]` from the values key
    const argument = values[key.replace('[]', '')]
    return JSON.parse(argument)
  }

  return values[key]
}

export const createTxObject = (
  method: AbiItem,
  contractAddress: string,
  values: Record<string, string>,
): ContractSendMethod => {
  const web3 = getWeb3()
  const contract: any = new web3.eth.Contract([method], contractAddress)
  const { inputs, name } = method
  const args = inputs.map(extractMethodArgs(name, values))

  return contract.methods[name](...args)
}

export const isReadMethod = (method: AbiItemExtended): boolean => method && method.action === 'read'

export const getValueFromTxInputs = (key: string, type: string, tx: TransactionReviewType): string => {
  if (isArrayParameter(type)) {
    // react-final-form removes the `[]` from the values key
    key = key.replace('[]', '')
  }

  let value = tx[key]

  if (type === 'bool') {
    value = String(value)
  }

  return value
}
