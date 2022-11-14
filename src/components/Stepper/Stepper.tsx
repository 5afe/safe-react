import { ReactElement } from 'react'
import StepperMUI from '@material-ui/core/Stepper'
import StepMUI from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/'

import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { boldFont, lg, sm } from 'src/theme/variables'
import { StepperProvider, useStepper } from './stepperContext'
import Track from 'src/components/Track'

type StepperProps = {
  children: ReactElement[]
  onFinish?: () => void
  disableNextButton?: boolean
  nextButtonType?: string
  testId?: string
  trackingCategory?: string
}

function StepperComponent(): ReactElement {
  const {
    currentStep,
    setCurrentStep,
    steps,

    onClickPreviousStep,
    onClickNextStep,

    disableNextButton,
    nextButtonType,

    testId,
    trackingCategory,
  } = useStepper()

  return (
    <StepperMUI data-testid={testId} activeStep={currentStep} orientation="vertical">
      {steps.map(function Step(step, index) {
        const isFirstStep = index === 0
        const isStepLabelClickable = currentStep > index
        const classes = useStyles({ isStepLabelClickable })

        function onClickLabel() {
          if (isStepLabelClickable) {
            setCurrentStep(index)
          }
        }

        const currentComponent = steps[index]

        const backButtonLabel = isFirstStep ? 'Cancel' : 'Back'
        const customNextButtonLabel = currentComponent.props.nextButtonLabel

        const nextButtonLabel = customNextButtonLabel || 'Next'

        const backButton = (
          <Button
            onClick={onClickPreviousStep}
            size="small"
            className={classes.nextButton}
            type="button"
            color="primary"
          >
            {backButtonLabel}
          </Button>
        )

        const nextButton = (
          <Button
            onClick={onClickNextStep}
            color="primary"
            variant="contained"
            type={nextButtonType || 'button'}
            disabled={disableNextButton || step.props.disableNextButton}
            size="small"
            className={classes.nextButton}
            variant="contained"
          >
            {nextButtonLabel}
          </Button>
        )

        return (
          <StepMUI key={step.props.label}>
            <StepLabel onClick={onClickLabel} className={classes.stepLabel}>
              {step.props.label}
            </StepLabel>
            <StepContent>
              <Paper className={classes.root} elevation={1}>
                {currentComponent}
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    {trackingCategory ? (
                      <>
                        <span style={{ padding: '5px' }}>
                          <Track category={trackingCategory} action={backButtonLabel} label={currentStep}>
                            {backButton}
                          </Track>
                        </span>
                        <span style={{ padding: '5px' }}>
                          <Track category={trackingCategory} action={nextButtonLabel} label={currentStep}>
                            {nextButton}
                          </Track>
                        </span>
                      </>
                    ) : (
                      <>
                        {backButton}
                        {nextButton}
                      </>
                    )}
                  </Col>
                </Row>
              </Paper>
            </StepContent>
          </StepMUI>
        )
      })}
    </StepperMUI>
  )
}

export default function Stepper(props: StepperProps): ReactElement {
  return (
    <StepperProvider stepsComponents={props.children} {...props}>
      <StepperComponent />
    </StepperProvider>
  )
}

const useStyles = makeStyles(() => ({
  root: {
    border: '#06fc99 2px solid',
    backgroundColor: 'black',
    margin: '10px 0 10px 10px',
    maxWidth: '800px',
  },
  controlStyle: {
    backgroundColor: 'black',
    padding: lg,
    borderRadius: sm,
  },
  backButton: {
    marginRight: sm,
    fontWeight: boldFont,
    // color: theme.palette.secondary.main,
    color: '#06fc99',
  },
  nextButton: {
    fontWeight: boldFont,
    backgroundColor: '#06fc99',
    boxShadow: 'none',
    color: '#000',
  },
  stepLabel: {
    cursor: ({ isStepLabelClickable }: any) => (isStepLabelClickable ? 'pointer' : 'inherit'),
    color: '#06fc99',
  },
}))

export type StepElementProps = {
  label: string
  children: JSX.Element
  nextButtonLabel?: string
  nextButtonType?: string
  disableNextButton?: boolean
}

export type StepElementType = (props: StepElementProps) => ReactElement

export function StepElement({ children }: StepElementProps): ReactElement {
  return children
}
