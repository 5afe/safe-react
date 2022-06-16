import React from 'react'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@gnosis.pm/safe-react-components'
import { Box } from '@material-ui/core'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { NotVoid } from 'lodash'

type SliderProps = {
  onCancel: () => NotVoid
  onComplete: () => void
}

type SliderState = {
  translate: number
  activeSlide: number
  transition: number
  _slides: React.ReactElement[]
}

const Slider: React.FC<SliderProps> = ({ onCancel, onComplete, children }) => {
  const slides = React.Children.toArray(children).filter(Boolean) as React.ReactElement[]
  const stateRef = useRef<SliderState>({
    translate: 1,
    activeSlide: 0,
    transition: 0.45,
    _slides: [],
  })
  const firstSlide = slides?.[0]
  const secondSlide = slides?.[1]
  const lastSlide = slides?.[slides?.length - 1]
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [state, setState] = useState<SliderState>({
    translate: 1,
    activeSlide: 0,
    transition: 0.45,
    _slides: [lastSlide, firstSlide, secondSlide],
  })

  stateRef.current = state

  useEffect(() => {
    const smooth = (e: TransitionEvent) => {
      if ((e.target as HTMLElement).className.includes('inner')) {
        smoothTransition()
      }
    }

    const transitionEnd: any = document.addEventListener('transitionend', smooth)

    return () => {
      document.removeEventListener('transitionend', transitionEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (disabledBtn) {
      setTimeout(() => {
        setDisabledBtn(false)
      }, 450)
    }
  }, [disabledBtn])

  useEffect(() => {
    if (stateRef.current.transition === 0) {
      setState((prev) => ({ ...prev, transition: 0.45 }))
    }
  }, [state.transition])

  const smoothTransition = () => {
    let _slides: React.ReactElement[] = []

    // We're at the last slide.
    if (stateRef.current.activeSlide === slides.length - 1) {
      _slides = [slides[slides.length - 2], lastSlide, firstSlide]
    }
    // We're back at the first slide. Just reset to how it was on initial render
    else if (stateRef.current.activeSlide === 0) {
      _slides = [lastSlide, firstSlide, secondSlide]
    }
    // Create an array of the previous last slide, and the next two slides that follow it.
    else {
      _slides = slides.slice(stateRef.current.activeSlide - 1, stateRef.current.activeSlide + 2)
    }

    setState({
      ...stateRef.current,
      _slides,
      translate: 1,
      transition: 0,
    })
  }
  const nextSlide = () => {
    if (disabledBtn) return

    if (stateRef.current.activeSlide === slides.length - 1) {
      onComplete()
      return
    }

    setDisabledBtn(true)

    setState({
      ...stateRef.current,
      translate: 2,
      activeSlide: stateRef.current.activeSlide === slides.length - 1 ? 0 : stateRef.current.activeSlide + 1,
    })
  }

  const prevSlide = () => {
    if (disabledBtn) return

    setDisabledBtn(true)

    setState({
      ...stateRef.current,
      translate: 0,
      activeSlide: stateRef.current.activeSlide === 0 ? slides.length - 1 : stateRef.current.activeSlide - 1,
    })
  }

  return (
    <>
      <StyledContainer className="container">
        <StyledInner
          className="inner"
          style={{
            transition: `transform ${stateRef.current.transition}s ease`,
            transform: `translateX(-${stateRef.current.translate * 100}%)`,
          }}
        >
          {stateRef.current._slides.map((slide, index) => (
            <SliderItem key={index}>{slide}</SliderItem>
          ))}
        </StyledInner>
      </StyledContainer>
      <Box display="flex" justifyContent="center" m={5}>
        {slides.length > 1 &&
          slides.map((_, index) => (
            <StyledDot key={index} color={index === stateRef.current.activeSlide ? 'primary' : 'secondaryLight'} />
          ))}
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        <Button
          color="primary"
          size="md"
          variant="bordered"
          fullWidth
          onClick={stateRef.current.activeSlide === 0 ? onCancel : prevSlide}
        >
          {stateRef.current.activeSlide === 0 ? 'Cancel' : 'Back'}
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

const StyledInner = styled.div`
  position: relative;
  display: flex;
  min-width: 100%;
  min-height: 100%;
  transform: translateX(0);
  height: 400px;
`

const StyledDot = styled.div<{ color: ThemeColors }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors[props.color]};
  margin: 0 8px;
`

const SliderItem = styled.div`
  min-width: 100%;
  min-height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export default Slider
