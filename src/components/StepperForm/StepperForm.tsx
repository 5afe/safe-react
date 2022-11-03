import React, { JSXElementConstructor, ReactElement, useMemo, useState } from 'react'
import { useEffect } from 'react'
import { Form } from 'react-final-form'
import { Validator } from '../forms/validator'
import Stepper, { StepElement, StepElementType } from '../Stepper/Stepper'
import { useStepper } from '../Stepper/stepperContext'

type StepperFormProps = {
  testId: string
  onSubmit: (values) => void
  initialValues?: any
  children: (JSX.Element | false | null)[]
  trackingCategory?: string
}

function StepperForm({ children, onSubmit, testId, initialValues, trackingCategory }: StepperFormProps): ReactElement {
  const [validate, setValidate] = useState<(values) => Validator>()
  const [onSubmitForm, setOnSubmitForm] = useState<(values) => void>()
  const steps = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(Boolean)
        .map((step: ReactElement, index, list) => {
          function ComponentStep() {
            const { setCurrentStep } = useStepper()
            useEffect(() => {
              const isLastStep = index === list.length - 1
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
            <StepElement key={step.props.label} nextButtonType={'submit'} {...step.props}>
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
          <Stepper disableNextButton={submitting} nextButtonType={'submit'} trackingCategory={trackingCategory}>
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
  disableNextButton?: boolean
}
export type StepFormElementType = (props: StepFormElementProps) => StepElementType[]

export function StepFormElement({ children }: StepFormElementProps): ReactElement {
  return children
}
