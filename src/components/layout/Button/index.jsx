// @flow
import * as React from 'react'
import Button from '@material-ui/core/Button'

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

const GnoButton = ({
  minWidth, minHeight = 27, testId = '', style = {}, ...props
}: Props) => {
  const calculatedStyle = calculateStyleBased(minWidth, minHeight)

  return <Button style={{ ...calculatedStyle, ...style }} data-testid={testId} {...props} />
}

export default GnoButton
