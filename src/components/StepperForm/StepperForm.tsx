import React, { JSXElementConstructor, ReactElement, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Form } from 'react-final-form'
import { Validator } from '../forms/validator'
import Stepper, { StepElement, StepElementType } from '../NewStepper/Stepper'
import { useStepper } from '../NewStepper/stepperContext'

type StepperFormProps = {
  testId: string
  onSubmit: (values) => void
  initialValues?: any
  children: (JSX.Element | false)[]
}

function StepperForm({ children, onSubmit, testId, initialValues }: StepperFormProps): ReactElement {
  const [validate, setValidate] = useState<(values) => Validator>()
  const [onSubmitForm, setOnSubmitForm] = useState<(values) => void>()
  const steps = useMemo(
    () =>
      children.map(function Step(step: any, index) {
        function ComponentStep() {
          const { setCurrentStep } = useStepper()
          useEffect(() => {
            const isLastStep = index === children.length - 1
            setValidate(() => step.props.validate)
            if (isLastStep) {
              setOnSubmitForm(() => (values) => onSubmit(values))
            } else {
              setOnSubmitForm(() => () => {
                setCurrentStep((step) => step + 1)
              })
            }
          }, [setCurrentStep])
          return step.props.children
        }
        return (
          <StepElement
            key={step.props.label}
            label={step.props.label}
            nextButtonLabel={step.props.nextButtonLabel}
            nextButtonType={'submit'}
          >
            <ComponentStep />
          </StepElement>
        )
      }),
    [children, onSubmit],
  )
  return (
    <Form
      onSubmit={(values) => onSubmitForm?.(values)}
      initialValues={initialValues}
      validate={(values) => validate?.(values)}
    >
      {({ handleSubmit, submitting }) => (
        <form data-testid={testId} onSubmit={handleSubmit}>
          <Stepper disableNextButton={submitting} nextButtonType={'submit'}>
            {steps}
          </Stepper>
        </form>
      )}
    </Form>
  )
}

export default StepperForm

export type StepFormElementProps = {
  label: string
  validate?: (values) => Record<string, unknown> | Promise<Record<string, string>>
  nextButtonLabel?: string
  children: ReactElement<any, string | JSXElementConstructor<any>>
}
export type StepFormElementType = (props: StepFormElementProps) => StepElementType[]

export function StepFormElement({ children }: StepFormElementProps): ReactElement {
  return children
}
