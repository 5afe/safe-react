// @flow
import Button from '@material-ui/core/Button'
import * as React from 'react'

type Props = {
  minWidth?: number,
  minHeight?: number,
  testId?: string,
  style?: Object,
}

const calculateStyleBased = (minWidth, minHeight) => ({
  minWidth: minWidth && `${minWidth}px`,
  minHeight: minHeight && `${minHeight}px`,
})

const GnoButton = ({ minWidth, minHeight = 35, testId = '', style = {}, ...props }: Props) => {
  const calculatedStyle = calculateStyleBased(minWidth, minHeight)

  return <Button data-testid={testId} style={{ ...calculatedStyle, ...style }} {...props} />
}

export default GnoButton
