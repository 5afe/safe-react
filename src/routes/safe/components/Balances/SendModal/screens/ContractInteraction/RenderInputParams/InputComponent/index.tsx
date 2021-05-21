import { Checkbox } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

import Col from 'src/components/layout/Col'
import Field from 'src/components/forms/Field'
import TextField from 'src/components/forms/TextField'

import { composeValidators, mustBeAddressHash, required } from 'src/components/forms/validator'
import { isArrayParameter } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import ArrayTypeInput from './ArrayTypeInput'

type Props = {
  type: string
  keyValue: string
  placeholder: string
}

export const InputComponent = ({ type, keyValue, placeholder }: Props): ReactElement | null => {
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
            validate={composeValidators(required, mustBeAddressHash)}
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
