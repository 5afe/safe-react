import React from 'react'
import { useField, useForm } from 'react-final-form'

import TextareaField from 'src/components/forms/TextareaField'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getContractABI } from 'src/config'
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
      const isEthereumAddress = mustBeEthereumAddress(contractAddress) === undefined
      const isEthereumContractAddress = (await mustBeEthereumContractAddress(contractAddress)) === undefined

      if (isEthereumAddress && isEthereumContractAddress) {
        const abi = await getContractABI(contractAddress)
        const isValidABI = hasUsefulMethods(abi) === undefined

        // this check may help in scenarios where the user first pastes the ABI,
        // and then sets a Proxy contract that has no useful methods
        if (isValidABI) {
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
