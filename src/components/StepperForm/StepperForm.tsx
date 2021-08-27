import React, { ReactElement } from 'react'
import { Form } from 'react-final-form'
import Stepper from '../NewStepper/Stepper'

export type StepForm = {
  component: () => ReactElement
  validations: () => void
  label: string
  nextButtonLabel?: string
}

type StepperFormProps = {
  // TODO: initialState
  testId: string
  steps: Array<StepForm>
  onSubmit: () => void
  // TODO: disableNextButton
  disableNextButton: boolean
}

// TODO: validations in each step!

function StepperForm({ steps, onSubmit, testId, disableNextButton }: StepperFormProps): ReactElement {
  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => (
        <form data-testid={testId} onSubmit={handleSubmit}>
          <Stepper steps={steps} onFinish={onSubmit} disableNextButton={disableNextButton} />
        </form>
      )}
    ></Form>
  )
}

export default StepperForm
