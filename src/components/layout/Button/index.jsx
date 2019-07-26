// @flow
import * as React from 'react'
import Button from '@material-ui/core/Button'

type Props = {
  minWidth?: number,
  minHeight?: number,
  rounded?: boolean,
  testId?: string,
  style?: Object,
}

const calculateStyleBased = (minWidth, minHeight, rounded) => ({
  minWidth: minWidth && `${minWidth}px`,
  minHeight: minHeight && `${minHeight}px`,
  borderRadius: rounded ? '4px' : 0,
})

const GnoButton = ({
  minWidth, minHeight = 27, testId = '', rounded, style = {}, ...props
}: Props) => {
  const calculatedStyle = calculateStyleBased(minWidth, minHeight, rounded)

  return <Button style={{ ...calculatedStyle, ...style }} data-testid={testId} {...props} />
}

export default GnoButton
