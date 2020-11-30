import { Button, Divider } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useMemo } from 'react'
import { useFormState } from 'react-final-form'
import styled from 'styled-components'

import GnoButton from 'src/components/layout/Button'
import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import { isAppManifestValid } from 'src/routes/safe/components/Apps/utils'

const StyledDivider = styled(Divider)`
  margin: 16px -24px;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

interface Props {
  appInfo: SafeApp
  onCancel: () => void
}

const FormButtons = ({ appInfo, onCancel }: Props): ReactElement => {
  const { valid, validating, visited } = useFormState({
    subscription: { valid: true, validating: true, visited: true },
  })

  const isSubmitDisabled = useMemo(() => {
    // if non visited, fields were not evaluated yet. Then, the default value is considered invalid
    const fieldsVisited = visited?.agreementAccepted && visited?.appUrl

    return validating || !valid || !fieldsVisited || !isAppManifestValid(appInfo)
  }, [validating, valid, visited, appInfo])

  return (
    <>
      <StyledDivider />
      <ButtonsContainer>
        <Button size="md" onClick={onCancel} color="secondary">
          Cancel
        </Button>
        <GnoButton color="primary" variant="contained" type="submit" disabled={isSubmitDisabled}>
          Add
        </GnoButton>
      </ButtonsContainer>
    </>
  )
}

export default FormButtons
