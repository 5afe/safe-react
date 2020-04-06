// 
import React from 'react'
import styled from 'styled-components'

import { IconText } from 'src/components-v2'
import CheckIcon from 'src/components/layout/PageFrame/assets/check.svg'
import {
  background as backgroundColor,
  secondaryText as disabledColor,
  error as errorColor,
  secondary,
} from 'src/theme/variables'

const Circle = styled.div`
  background-color: ${({ disabled, error }) => {
    if (error) {
      return errorColor
    }
    if (disabled) {
      return disabledColor
    }

    return secondary
  }};
  color: ${backgroundColor};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`

const DotStep = ({ currentIndex, dotIndex, error }) => {
  return (
    <Circle disabled={dotIndex > currentIndex} error={error}>
      {dotIndex < currentIndex ? <IconText iconUrl={CheckIcon} /> : dotIndex + 1}
    </Circle>
  )
}

export default DotStep
