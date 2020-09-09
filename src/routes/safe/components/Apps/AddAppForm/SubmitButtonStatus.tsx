import React from 'react'
import { useFormState } from 'react-final-form'

import { SafeApp } from 'src/routes/safe/components/Apps/types.d'
import { isAppManifestValid } from 'src/routes/safe/components/Apps/utils'

interface SubmitButtonStatusProps {
  appInfo: SafeApp
  onSubmitButtonStatusChange: (disabled: boolean) => void
}

const SubmitButtonStatus = ({ appInfo, onSubmitButtonStatusChange }: SubmitButtonStatusProps): null => {
  const { valid, validating, visited } = useFormState({
    subscription: { valid: true, validating: true, visited: true },
  })

  React.useEffect(() => {
    // if non visited, fields were not evaluated yet. Then, the default value is considered invalid
    const fieldsVisited = visited?.agreementAccepted && visited.appUrl

    onSubmitButtonStatusChange(validating || !valid || !fieldsVisited || !isAppManifestValid(appInfo))
  }, [validating, valid, visited, onSubmitButtonStatusChange, appInfo])

  return null
}

export default SubmitButtonStatus
