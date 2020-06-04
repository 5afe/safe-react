import React from 'react'
import { useField } from 'react-final-form'

import Row from 'src/components/layout/Row'

import InputComponent from './InputComponent'

const RenderInputParams = () => {
  const {
    meta: { valid: validABI },
  } = useField('abi', { value: true })
  const {
    input: { value: method },
  }: any = useField('selectedMethod', { value: true })
  const renderInputs = validABI && !!method && method.inputs.length

  return !renderInputs
    ? null
    : method.inputs.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = `methodInput-${method.name}_${index}_${type}`

        return (
          <Row key={key} margin="sm">
            <InputComponent type={type} keyValue={key} placeholder={placeholder} />
          </Row>
        )
      })
}

export default RenderInputParams
