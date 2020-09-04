import { Checkbox } from '@gnosis.pm/safe-react-components'
import React from 'react'

import Col from 'src/components/layout/Col'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'

import { composeValidators, mustBeEthereumAddress, required } from 'src/components/forms/validator'
import { isArrayParameter } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import ArrayTypeInput from './ArrayTypeInput'

type Props = {
  type: string
  keyValue: string
  placeholder: string
}

const InputComponent = ({ type, keyValue, placeholder }: Props): React.ReactElement | null => {
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
          {isArrayParameter(type) ? (
            <ArrayTypeInput name={keyValue} text={placeholder} type={type} />
          ) : (
            <Field
              component={TextField}
              name={keyValue}
              placeholder={placeholder}
              testId={keyValue}
              text={placeholder}
              type="text"
              validate={required}
            />
          )}
        </Col>
      )
    }
  }
}

export default InputComponent
