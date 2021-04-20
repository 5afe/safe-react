import { Checkbox, Text } from '@gnosis.pm/safe-react-components'
import React, { useState } from 'react'
import { useFormState } from 'react-final-form'
import styled from 'styled-components'

import { required } from 'src/components/forms/validator'
import Field from 'src/components/forms/Field'

const StyledCheckbox = styled(Checkbox)`
  margin: 0;
`
const StyledAgreementContainer = styled.div`
  display: flex;
  flex: 1;
  .MuiFormControlLabel-root {
    margin-right: 0;
  }
`

const AppAgreement = (): React.ReactElement => {
  const { visited } = useFormState({ subscription: { visited: true } })
  const [checked, setCheck] = useState(false)
  // trick to prevent having the field validated by default. Not sure why this happens in this form
  const validate = !visited?.agreementAccepted ? undefined : required

  const handleOnChange = ({ onBlur, onFocus, onChange }, event, value: boolean) => {
    onFocus(event)
    onChange(event)
    onBlur(event)
    setCheck(value)
  }

  return (
    <Field name="agreementAccepted" type="checkbox" validate={validate}>
      {({ input }) => (
        <StyledAgreementContainer>
          <StyledCheckbox
            checked={checked}
            name="agreementAccepted"
            label=""
            onChange={(ev, value) => handleOnChange(input, ev, value)}
          />
          <Text size="xl">
            This app is not a Gnosis product and I agree to use this app
            <br />
            at my own risk.
          </Text>
        </StyledAgreementContainer>
      )}
    </Field>
  )
}

export default AppAgreement
