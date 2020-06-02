import React from 'react'
import { useField } from 'react-final-form'

import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'
import { composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import Checkbox from 'src/components/forms/Checkbox'

const RenderInputParams = () => {
  const {
    meta: { valid: validABI },
  } = useField('abi', { valid: true } as any)
  const {
    input: { value: method },
  }: any = useField('selectedMethod', { value: true })
  const renderInputs = validABI && !!method && method.inputs.length

  const renderInputComponent = (type, name, key, placeholder) => {
    if (!type) {
      return null
    }
    switch (type) {
      case 'bool': {
        const inputProps = {
          'data-testid': key,
        }
        return (
          <Col>
            <Field component={Checkbox} name={key} label={placeholder} type="checkbox" inputProps={inputProps} />
          </Col>
        )
      }
      case 'address': {
        return (
          <Col>
            <Field
              component={TextField}
              name={key}
              placeholder={placeholder}
              testId={key}
              text={placeholder}
              type="text"
              validate={composeValidators(required, mustBeEthereumAddress)}
            />
          </Col>
        )
      }
      default: {
        return (
          <Col>
            <Field
              component={TextField}
              name={key}
              placeholder={placeholder}
              testId={key}
              text={placeholder}
              type="text"
              validate={required}
            />
          </Col>
        )
      }
    }
  }

  return !renderInputs
    ? null
    : method.inputs.map(({ name, type }, index) => {
        const placeholder = name ? `${name} (${type})` : type
        const key = `methodInput-${method.name}_${index}_${type}`

        return (
          <Row key={key} margin="sm">
            {renderInputComponent(type, name, key, placeholder)}
          </Row>
        )
      })
}

export default RenderInputParams
