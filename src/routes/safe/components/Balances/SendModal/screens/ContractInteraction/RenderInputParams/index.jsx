// @flow
import React from 'react'
import { useField } from 'react-final-form'

import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { composeValidators, mustBeEthereumAddress, required } from '~/components/forms/validator'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'

const RenderInputParams = () => {
  const {
    meta: { valid: validABI },
  } = useField('abi', { valid: true })
  const {
    input: { value: method },
  } = useField('selectedMethod', { value: true })
  const renderInputs = validABI && !!method && method.inputs.length

  return !renderInputs
    ? null
    : method.inputs.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = `methodInput-${method.name}_${index}_${type}`
        const validate = type === 'address' ? composeValidators(required, mustBeEthereumAddress) : required

        return (
          <Row key={key} margin="sm">
            <Col>
              <Field
                component={TextField}
                name={key}
                placeholder={placeholder}
                testId={key}
                text={placeholder}
                type="text"
                validate={validate}
              />
            </Col>
          </Row>
        )
      })
}

export default RenderInputParams
