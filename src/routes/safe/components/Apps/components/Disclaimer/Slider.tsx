import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@gnosis.pm/safe-react-components'
import { Box } from '@material-ui/core'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'

type SliderState = {
  translate: number
  activeSlide: number
  transition: number
  _slides: React.ReactElement[]
}

const Slider: React.FC = ({ children }) => {
  const stateRef = useRef<SliderState>({
    translate: 1,
    activeSlide: 0,
    transition: 0.45,
    _slides: [],
  })
  const slides = children as React.ReactElement[]

  const firstSlide = slides?.[0]
  const secondSlide = slides?.[1]
  const lastSlide = slides?.[slides?.length - 1]

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
    if (stateRef.current.activeSlide === slides.length - 1) {
      // TODO: End process
      return
    }

    setState({
      ...stateRef.current,
      translate: 2,
      activeSlide: stateRef.current.activeSlide === slides.length - 1 ? 0 : stateRef.current.activeSlide + 1,
    })
  }

  const prevSlide = () => {
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
          {stateRef.current._slides.map((slide) => slide)}
        </StyledInner>
      </StyledContainer>
      <Box display="flex" justifyContent="center" m={5}>
        {stateRef.current._slides.map((slide, index) => (
          <StyledDot key={index} color={index === stateRef.current.activeSlide ? 'primary' : 'secondaryLight'} />
        ))}
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        {stateRef.current.activeSlide !== 0 && (
          <Button color="primary" size="md" variant="bordered" fullWidth onClick={prevSlide}>
            Back
          </Button>
        )}

        <Button
          color="primary"
          size="md"
          fullWidth
          onClick={nextSlide}
          style={{
            width: stateRef.current.activeSlide !== 0 ? '100%' : '50%',
            marginLeft: stateRef.current.activeSlide !== 0 ? 10 : 0,
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
`

const StyledDot = styled.div<{ color: ThemeColors }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors[props.color]};
  margin: 0 8px;
`

export const SliderItem = styled.div`
  min-width: 100%;
  min-height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export default Slider
