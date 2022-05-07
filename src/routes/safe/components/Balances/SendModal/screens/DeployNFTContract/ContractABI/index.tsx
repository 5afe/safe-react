import { useField, useForm } from 'react-final-form'
import { useRef, useEffect } from 'react'

import { TextAreaField } from 'src/components/forms/TextAreaField'
import { mustBeEthereumAddress, mustBeEthereumContractAddress } from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { getContractABI } from 'src/config'
import { extractUsefulMethods } from 'src/logic/contractInteraction/sources/ABIService'
import { parsePrefixedAddress } from 'src/utils/prefixedAddress'

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
  const setAbiValue = useRef(mutators.setAbiValue)

  useEffect(() => {
    const validateAndSetAbi = async () => {
      const isEthereumAddress = mustBeEthereumAddress(contractAddress) === undefined
      const isEthereumContractAddress = (await mustBeEthereumContractAddress(contractAddress)) === undefined

      if (isEthereumAddress && isEthereumContractAddress) {
        const { address } = parsePrefixedAddress(contractAddress)
        const abi = await getContractABI(address)
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
        <TextAreaField name="abi" placeholder="ABI*" label="ABI*" type="text" validate={hasUsefulMethods} />
      </Col>
    </Row>
  )
}

export default ContractABI
