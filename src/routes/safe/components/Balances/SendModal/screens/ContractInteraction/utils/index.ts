import { FORM_ERROR } from 'final-form'
import createDecorator from 'final-form-calculate'
import { AbiItem } from 'web3-utils'

import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/contractInteraction/sources'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'
import { getWeb3 } from 'src/logic/wallets/getWeb3'

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
        return NO_CONTRACT
      }
      const network = getNetwork()
      const source = getConfiguredSource()
      return source.getContractABI(contractAddress, network)
    },
  },
})

export const formMutators = {
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

export const handleSubmitError = (error, values) => {
  for (const key in values) {
    if (values.hasOwnProperty(key) && values[key] === error.value) {
      return { [key]: error.reason }
    }
  }

  // .call() failed and we're logging a generic error
  return { [FORM_ERROR]: error.message }
}

export const createTxObject = (method: AbiItem, contractAddress: string, values) => {
  const web3 = getWeb3()
  const contract: any = new web3.eth.Contract([method], contractAddress)
  const { inputs, name } = method
  const args = inputs.map(({ type }, index) => values[`methodInput-${name}_${index}_${type}`])

  return contract.methods[name](...args)
}

export const isReadMethod = (method: AbiItemExtended): boolean => method && method.action === 'read'
