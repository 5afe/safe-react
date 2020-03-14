// @flow
import StepMUI from '@material-ui/core/Step'
import StepLabelMUI from '@material-ui/core/StepLabel'
import StepperMUI from '@material-ui/core/Stepper'
import React from 'react'
import styled from 'styled-components'

import DotStep from './DotStep'

import { secondaryText as disabled, error as errorColor, primary, secondary } from '~/theme/variables'

const StyledStepper = styled(StepperMUI)`
  background-color: transparent;
`

const StyledStepLabel = styled.p`
  && {
    color: ${({ activeStepIndex, error, index }) => {
      if (error) {
        return errorColor
      }

      if (index === activeStepIndex) {
        return secondary
      }

      if (index < activeStepIndex) {
        return disabled
      }

      return primary
    }};
  }
`

type Props = {
  steps: Array<{ id: string | number, label: string }>,
  activeStepIndex: number,
  error?: boolean,
  orientation: 'vertical' | 'horizontal',
}

const Stepper = ({ activeStepIndex, error, orientation, steps }: Props) => {
  return (
    <StyledStepper activeStep={activeStepIndex} orientation={orientation}>
      {steps.map((s, index) => {
        return (
          <StepMUI key={s.id}>
            <StepLabelMUI
              icon={
                <DotStep currentIndex={activeStepIndex} dotIndex={index} error={index === activeStepIndex && error} />
              }
            >
              <StyledStepLabel
                activeStepIndex={activeStepIndex}
                error={index === activeStepIndex && error}
                index={index}
              >
                {s.label}
              </StyledStepLabel>
            </StepLabelMUI>
          </StepMUI>
        )
      })}
    </StyledStepper>
  )
}

export default Stepper
