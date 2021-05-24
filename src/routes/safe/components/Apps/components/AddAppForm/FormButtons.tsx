import React, { ReactElement, useMemo } from 'react'
import { useFormState } from 'react-final-form'

import { Modal } from 'src/components/Modal'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { isAppManifestValid } from 'src/routes/safe/components/Apps/utils'

interface Props {
  appInfo: SafeApp
  onCancel: () => void
}

export const FormButtons = ({ appInfo, onCancel }: Props): ReactElement => {
  const { valid, validating, visited } = useFormState({
    subscription: { valid: true, validating: true, visited: true },
  })

  const isSubmitDisabled = useMemo(() => {
    // if non visited, fields were not evaluated yet. Then, the default value is considered invalid
    const fieldsVisited = visited?.agreementAccepted && visited?.appUrl

    return validating || !valid || !fieldsVisited || !isAppManifestValid(appInfo)
  }, [validating, valid, visited, appInfo])

  return (
    <Modal.Footer.Buttons
      cancelButtonProps={{ onClick: onCancel }}
      confirmButtonProps={{ disabled: isSubmitDisabled, text: 'Add' }}
    />
  )
}
