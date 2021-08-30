import React, { ReactElement } from 'react'

export const loadSafeOwnersStepLabel = 'Owners'

function LoadSafeOwnersStep(): ReactElement {
  return <div>Second step: LoadSafeOwnersStep</div>
}

export default LoadSafeOwnersStep

export const loadSafeOwnersStepValidation = (values) => {
  const errors = {}
  console.log('Validations for Owners', values)
  return errors
}
