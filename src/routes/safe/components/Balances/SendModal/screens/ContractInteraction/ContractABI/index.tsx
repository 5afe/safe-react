import React from 'react'
import { useField, useForm } from 'react-final-form'

import TextareaField from 'src/components/forms/TextareaField'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getNetwork } from 'src/config'
import { getConfiguredSource } from 'src/logic/contractInteraction/sources'
import { extractUsefulMethods } from 'src/logic/contractInteraction/sources/ABIService'

export const NO_DATA = 'no data'

const hasUsefulMethods = (abi: string): undefined | string => {
  try {
    const parsedABI = extractUsefulMethods(JSON.parse(abi))

    if (parsedABI.length === 0) {
      return NO_DATA
    }
  } catch (e) {
    return NO_DATA
  }
}

const ContractABI = (): React.ReactElement => {
  const {
    input: { value: contractAddress },
  } = useField('contractAddress', { subscription: { value: true } })
  const { mutators } = useForm()
  const setAbiValue = React.useRef(mutators.setAbiValue)

  React.useEffect(() => {
    const validateAndSetAbi = async () => {
      if (!mustBeEthereumAddress(contractAddress) && !(await mustBeEthereumContractAddress(contractAddress))) {
        const network = getNetwork()
        const source = getConfiguredSource()
        const abi = await source.getContractABI(contractAddress, network)

        // this check may help in scenarios where the user first pastes the ABI,
        // and then sets a Proxy contract that has no useful methods
        if (hasUsefulMethods(abi) === undefined) {
          setAbiValue.current(abi)
        }
      }
    }

    if (contractAddress) {
      validateAndSetAbi()
    }
  }, [contractAddress])

  return (
    <Row margin="sm">
      <Col>
        <TextareaField name="abi" placeholder="ABI*" text="ABI*" type="text" validate={hasUsefulMethods} />
      </Col>
    </Row>
  )
}

export default ContractABI
