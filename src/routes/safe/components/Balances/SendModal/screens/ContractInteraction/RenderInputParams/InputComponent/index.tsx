import React from 'react'
import Col from '../../../../../../../../../components/layout/Col'
import Field from '../../../../../../../../../components/forms/Field'
import Checkbox from '../../../../../../../../../components/forms/Checkbox'
import TextField from '../../../../../../../../../components/forms/TextField'
import {
  composeValidators,
  mustBeEthereumAddress,
  required,
} from '../../../../../../../../../components/forms/validator'

type Props = {
  type: string
  keyValue: string
  placeholder: string
}

const InputComponent = ({ type, keyValue, placeholder }: Props) => {
  if (!type) {
    return null
  }
  switch (type) {
    case 'bool': {
      const inputProps = {
        'data-testid': keyValue,
      }
      return (
        <Col>
          <Field component={Checkbox} name={keyValue} label={placeholder} type="checkbox" inputProps={inputProps} />
        </Col>
      )
    }
    case 'address': {
      return (
        <Col>
          <Field
            component={TextField}
            name={keyValue}
            placeholder={placeholder}
            testId={keyValue}
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
            name={keyValue}
            placeholder={placeholder}
            testId={keyValue}
            text={placeholder}
            type="text"
            validate={required}
          />
        </Col>
      )
    }
  }
}

export default InputComponent
