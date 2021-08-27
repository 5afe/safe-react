import React, { ReactElement, useState } from 'react'
import StepperMUI from '@material-ui/core/Stepper'
import StepMUI from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/'

import Block from '../layout/Block'
import Hairline from '../layout/Hairline'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { boldFont, lg, sm } from 'src/theme/variables'
import { history } from 'src/store'

export type StepProps = {
  component: () => ReactElement
  label: string
  nextButtonLabel?: string
}

type StepperProps = {
  steps: Array<StepProps>
  onFinish: () => void
  disableNextButton?: boolean
}

function Stepper({ steps, onFinish, disableNextButton }: StepperProps): ReactElement {
  const [currentStep, setCurrentStep] = useState(0)
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep > steps.length - 2

  const classes = useStyles()

  const { component: CurrentStepComponent, nextButtonLabel: customNextButtonLabel } = steps[currentStep]

  const onClickPreviousStep = () => {
    if (isFirstStep) {
      history.goBack()
    } else {
      setCurrentStep((step) => step - 1)
    }
  }

  const onClickNextStep = () => {
    if (isLastStep) {
      onFinish()
    } else {
      setCurrentStep((step) => step + 1)
    }
  }

  const backButtonLabel = isFirstStep ? 'Cancel' : 'Back'
  const nextButtonLabel = customNextButtonLabel || 'next'

  return (
    <StepperMUI activeStep={currentStep} orientation="vertical">
      {steps.map((step, index) => {
        const isStepLabelClickable = currentStep > index

        function onClickLabel() {
          if (isStepLabelClickable) {
            setCurrentStep(index)
          }
        }

        const stepLabelStyles = {
          cursor: isStepLabelClickable ? 'pointer' : 'inherit',
        }

        return (
          <StepMUI key={step.label}>
            <StepLabel onClick={onClickLabel} style={stepLabelStyles}>
              {step.label}
            </StepLabel>
            <StepContent>
              <Paper className={classes.root} elevation={1}>
                <Block className={classes.padding}>
                  <CurrentStepComponent />
                </Block>
                <Hairline />
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    <Button onClick={onClickPreviousStep} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <Button
                      onClick={onClickNextStep}
                      color="primary"
                      disabled={disableNextButton}
                      size="small"
                      className={classes.nextButton}
                      variant="contained"
                    >
                      {nextButtonLabel}
                    </Button>
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

export default Stepper

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '10px 0 10px 10px',
    maxWidth: '770px',
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
  },
  padding: {
    padding: lg,
  },
  controlStyle: {
    backgroundColor: 'white',
    padding: lg,
    borderRadius: sm,
  },
  backButton: {
    marginRight: sm,
    fontWeight: boldFont,
    color: theme.palette.secondary.main,
  },
  nextButton: {
    fontWeight: boldFont,
  },
}))
