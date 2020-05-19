import Button from '@material-ui/core/Button'
import * as React from 'react'

const calculateStyleBased = (minWidth, minHeight) => ({
  minWidth: minWidth && `${minWidth}px`,
  minHeight: minHeight && `${minHeight}px`,
})

const GnoButton = ({ minWidth, minHeight = 35, testId = '', style = {}, ...props }: any) => {
  const calculatedStyle = calculateStyleBased(minWidth, minHeight)

  return <Button data-testid={testId} style={{ ...calculatedStyle, ...style }} {...props} />
}

export default GnoButton
