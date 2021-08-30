import React, { ReactElement } from 'react'
import { useForm } from 'react-final-form'
import { useStepper } from 'src/components/NewStepper/stepperContext'

export const loadSafeOwnersStepLabel = 'Owners'

function LoadSafeOwnersStep(): ReactElement {
  const loadSafeForm = useForm()
  const loadSafeStepper = useStepper()

  const formValues = loadSafeForm.getState().values

  console.log('FORM VALUES !', formValues)
  console.log('STEPPER VALUES', loadSafeStepper)
  return <div>Second step: LoadSafeOwnersStep</div>
}

export default LoadSafeOwnersStep

export const loadSafeOwnersStepValidation = (values) => {
  const errors = {}
  console.log('Validations for Owners', values)
  return errors
}
