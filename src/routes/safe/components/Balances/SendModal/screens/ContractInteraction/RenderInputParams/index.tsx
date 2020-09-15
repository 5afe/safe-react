import React from 'react'
import { useField } from 'react-final-form'

import Row from 'src/components/layout/Row'

import InputComponent from './InputComponent'
import { generateFormFieldKey } from '../utils'
import { AbiItemExtended } from 'src/logic/contractInteraction/sources/ABIService'

const RenderInputParams = (): React.ReactElement | null => {
  const {
    meta: { valid: validABI },
  } = useField('abi', { subscription: { valid: true, value: true } })
  const {
    input: { value: method },
  }: { input: { value: AbiItemExtended } } = useField('selectedMethod', { subscription: { value: true } })
  const renderInputs = validABI && !!method && method.inputs?.length

  return !renderInputs ? null : (
    <>
      {method.inputs?.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = generateFormFieldKey(type, method.signatureHash, index)

        return (
          <Row key={key} margin="sm">
            <InputComponent type={type} keyValue={key} placeholder={placeholder} />
          </Row>
        )
      })}
    </>
  )
}

export default RenderInputParams
