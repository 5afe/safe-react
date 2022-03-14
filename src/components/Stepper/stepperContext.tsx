import { useContext, ReactElement, useState, Children, createContext } from 'react'
import { history } from 'src/routes/routes'

const StepperContext = createContext<StepperProviderTypes>({} as StepperProviderTypes)

function useStepper(): any {
  const context = useContext(StepperContext)

  const hasContextDefined = Object.keys(context).length > 0

  if (!hasContextDefined) {
    throw new Error('useStepper must be used within a StepperProvider!')
  }

  return context
}

type StepperProviderTypes = {
  onFinish?: () => void
  store?: any
  disableNextButton?: boolean
  stepsComponents: ReactElement[]
  children: ReactElement
  testId?: string
  trackingCategory?: string
}

function StepperProvider({
  onFinish,
  store,
  disableNextButton,
  stepsComponents,
  children,
  testId,
  trackingCategory,
}: StepperProviderTypes): ReactElement {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = Children.toArray(stepsComponents)
  const CurrentStepComponent: any = steps[currentStep]

  const nextButtonType = CurrentStepComponent.props.nextButtonType
  const nextButtonLabel = CurrentStepComponent.props.nextButtonLabel

  const isSubmitButton = nextButtonType === 'submit'
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep > steps.length - 2
  const customNextButtonLabel = nextButtonLabel

  const onClickPreviousStep = () => {
    if (isFirstStep) {
      history.goBack()
    } else {
      setCurrentStep((step) => step - 1)
    }
  }

  const onClickNextStep = () => {
    if (isSubmitButton) {
      return
    }

    if (isLastStep) {
      onFinish?.()
      return
    }

    setCurrentStep((step) => step + 1)
  }

  const state: StepperProviderTypes = {
    currentStep,
    setCurrentStep,
    steps,

    CurrentStepComponent,

    isFirstStep,
    isLastStep,

    onClickPreviousStep,
    onClickNextStep,

    disableNextButton,
    nextButtonType,
    customNextButtonLabel,

    testId,
    trackingCategory,

    ...store,
  }

  return <StepperContext.Provider value={state}>{children}</StepperContext.Provider>
}

export { useStepper, StepperProvider }
