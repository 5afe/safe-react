import React from 'react'
import { useFormState } from 'react-final-form'
import styled from 'styled-components'
import { Text } from '@gnosis.pm/safe-react-components'

import { required } from 'src/components/forms/validator'
import Field from 'src/components/forms/Field'
import FinalFormCheckbox from 'src/components/forms/FinalFormCheckbox'

const StyledCheckbox = styled(FinalFormCheckbox)`
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

  // trick to prevent having the field validated by default. Not sure why this happens in this form
  const validate = !visited?.agreementAccepted ? undefined : required

  return (
    <StyledAgreementContainer>
      <Field
        name="agreementAccepted"
        type="checkbox"
        label={
          <Text size="xl">
            This app is not a Gnosis product and I agree to use this app
            <br />
            at my own risk.
          </Text>
        }
        component={StyledCheckbox}
        validate={validate}
      />
    </StyledAgreementContainer>
  )
}

export default AppAgreement
