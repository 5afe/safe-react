import React from 'react'
import { useFormState } from 'react-final-form'

import { SafeApp } from 'src/routes/safe/components/Apps/types'

interface SubmitButtonStatusProps {
  appInfo: SafeApp
  isSubmitDisabled: (disabled: boolean) => void
}

const SubmitButtonStatus = ({ appInfo, isSubmitDisabled }: SubmitButtonStatusProps): React.ReactElement => {
  const { valid, validating, values } = useFormState({ subscription: { valid: true, validating: true, values: true } })

  React.useEffect(() => {
    isSubmitDisabled(
      validating || !valid || appInfo.error || !appInfo.url || !appInfo.name || appInfo.name === 'unknown',
    )
  }, [validating, valid, appInfo.error, appInfo.url, appInfo.name, values, isSubmitDisabled])

  return null
}

export default SubmitButtonStatus
