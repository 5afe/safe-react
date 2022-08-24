import { Checkbox, Text } from '@gnosis.pm/safe-react-components'

import { useFormState } from 'react-final-form'
import styled from 'styled-components'

import { required } from 'src/components/forms/validator'
import Field from 'src/components/forms/Field'

const StyledCheckbox = styled(Checkbox)`
  margin: 0;
`

const AppAgreement = (): React.ReactElement => {
  const { visited } = useFormState({ subscription: { visited: true } })

  // trick to prevent having the field validated by default. Not sure why this happens in this form
  const validate = !visited?.agreementAccepted ? undefined : required

  return (
    <Field
      component={StyledCheckbox}
      label={<Text size="xl">This app is not part of the Safe and I agree to use this app at my own risk.</Text>}
      name="agreementAccepted"
      type="checkbox"
      validate={validate}
    />
  )
}

export default AppAgreement
