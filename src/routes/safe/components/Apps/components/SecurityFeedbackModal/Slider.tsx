import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Box } from '@material-ui/core'
import { Button } from '@gnosis.pm/safe-react-components'

type SliderProps = {
  onSlideChange: (slideIndex: number) => void
  initialStep?: number
}

const SLIDER_TIMEOUT = 500

const Slider: React.FC<SliderProps> = ({ onSlideChange, children, initialStep }) => {
  const allSlides = useMemo(() => React.Children.toArray(children).filter(Boolean) as React.ReactElement[], [children])

  const [activeStep, setActiveStep] = useState(initialStep || 0)
  const [disabledBtn, setDisabledBtn] = useState(false)

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>

    if (disabledBtn) {
      id = setTimeout(() => {
        setDisabledBtn(false)
      }, SLIDER_TIMEOUT)
    }

    return () => {
      if (id) clearTimeout(id)
    }
  }, [disabledBtn])

  const nextSlide = () => {
    if (disabledBtn) return

    const nextStep = activeStep + 1

    onSlideChange(nextStep)
    setActiveStep(nextStep)
    setDisabledBtn(true)
  }

  const prevSlide = () => {
    if (disabledBtn) return

    const prevStep = activeStep - 1

    onSlideChange(prevStep)
    setActiveStep(prevStep)
    setDisabledBtn(true)
  }

  const isFirstStep = activeStep === 0

  return (
    <>
      <StyledContainer className="container">
        <StyledInner className="inner" activeStep={activeStep}>
          {allSlides.map((slide, index) => (
            <SliderItem key={index}>{slide}</SliderItem>
          ))}
        </StyledInner>
      </StyledContainer>
      <Box display="flex" justifyContent="center" width="100%">
        <Button color="primary" size="md" variant="bordered" fullWidth onClick={prevSlide}>
          {isFirstStep ? 'Cancel' : 'Back'}
        </Button>

        <Button
          color="primary"
          size="md"
          fullWidth
          onClick={nextSlide}
          style={{
            marginLeft: 10,
          }}
        >
          Continue
        </Button>
      </Box>
    </>
  )
}

const StyledContainer = styled.div`
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const StyledInner = styled.div<{ activeStep: number }>`
  position: relative;
  display: flex;
  min-width: 100%;
  min-height: 100%;
  transform: translateX(0);
  height: 426px;

  transition: transform 0.5s ease;
  transform: translateX(-${({ activeStep }) => activeStep * 100}%);
`

const SliderItem = styled.div`
  min-width: 100%;
  min-height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export default Slider
