import React from 'react'
import { useFormState } from 'react-final-form'

import { SafeApp } from 'src/routes/safe/components/Apps/types'

interface SubmitButtonStatusProps {
  appInfo: SafeApp
  onSubmitButtonStatusChange: (disabled: boolean) => void
}

const SubmitButtonStatus = ({ appInfo, onSubmitButtonStatusChange }: SubmitButtonStatusProps): React.ReactElement => {
  const { valid, validating, values } = useFormState({ subscription: { valid: true, validating: true, values: true } })

  React.useEffect(() => {
    onSubmitButtonStatusChange(
      validating || !valid || appInfo.error || !appInfo.url || !appInfo.name || appInfo.name === 'unknown',
    )
  }, [validating, valid, appInfo.error, appInfo.url, appInfo.name, values, onSubmitButtonStatusChange])

  return null
}

export default SubmitButtonStatus
