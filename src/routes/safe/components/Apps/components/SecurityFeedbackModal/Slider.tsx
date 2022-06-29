import React from 'react'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@gnosis.pm/safe-react-components'
import { Box } from '@material-ui/core'
type SliderProps = {
  onCancel: () => void
  onSlideChange: (slideIndex: number) => void
  onComplete: () => void
}
type SliderState = {
  translate: number
  activeSlide: number
  transition: number
  renderedSlides: React.ReactElement[]
}

const SLIDER_TIMEOUT = 500

const Slider: React.FC<SliderProps> = ({ onCancel, onSlideChange, onComplete, children }) => {
  const allSlides = React.Children.toArray(children).filter(Boolean) as React.ReactElement[]
  const stateRef = useRef<SliderState>({
    translate: 1,
    activeSlide: 0,
    transition: 0.45,
    renderedSlides: [],
  })
  const firstSlide = allSlides?.[0]
  const secondSlide = allSlides?.[1]
  const lastSlide = allSlides?.[allSlides?.length - 1]
  const [disabledBtn, setDisabledBtn] = useState(false)
  const [state, setState] = useState<SliderState>({
    translate: 1,
    activeSlide: 0,
    transition: 0.45,
    renderedSlides: [lastSlide, firstSlide, secondSlide],
  })

  stateRef.current = state

  useEffect(() => {
    const smooth = (e: TransitionEvent) => {
      if ((e.target as HTMLElement).className.includes('inner')) {
        smoothTransition()
      }
    }

    document.addEventListener('transitionend', smooth)

    return () => {
      document.removeEventListener('transitionend', smooth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  useEffect(() => {
    if (stateRef.current.transition === 0) {
      setState((prev) => ({ ...prev, transition: 0.45 }))
    }
  }, [state.transition])

  const smoothTransition = () => {
    let slides: React.ReactElement[] = []

    if (stateRef.current.activeSlide === allSlides.length - 1) {
      slides = [allSlides[allSlides.length - 2], lastSlide, firstSlide]
    } else if (stateRef.current.activeSlide === 0) {
      slides = [lastSlide, firstSlide, secondSlide]
    } else {
      slides = allSlides.slice(stateRef.current.activeSlide - 1, stateRef.current.activeSlide + 2)
    }

    setState({
      ...stateRef.current,
      renderedSlides: slides,
      translate: 1,
      transition: 0,
    })
  }
  const nextSlide = () => {
    if (disabledBtn) return

    if (stateRef.current.activeSlide === allSlides.length - 1) {
      onComplete()
      return
    }

    const activeSlide = stateRef.current.activeSlide === allSlides.length - 1 ? 0 : stateRef.current.activeSlide + 1

    onSlideChange(activeSlide)
    setDisabledBtn(true)
    setState({
      ...stateRef.current,
      translate: 2,
      activeSlide,
    })
  }

  const prevSlide = () => {
    if (disabledBtn) return

    const activeSlide = stateRef.current.activeSlide === 0 ? allSlides.length - 1 : stateRef.current.activeSlide - 1

    onSlideChange(activeSlide)
    setDisabledBtn(true)
    setState({
      ...stateRef.current,
      translate: 0,
      activeSlide,
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
          {stateRef.current.renderedSlides.map((slide, index) => (
            <SliderItem key={index}>{slide}</SliderItem>
          ))}
        </StyledInner>
      </StyledContainer>
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
  height: 426px;
`

const SliderItem = styled.div`
  min-width: 100%;
  min-height: 100%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export default Slider
