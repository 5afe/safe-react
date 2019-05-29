// @flow
import * as React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    borderRadius: 0,
  },
}

type Props = {
  minWidth?: number,
  minHeight?: number,
}

const calculateStyleBased = (minWidth, minHeight) => ({
  minWidth: minWidth && `${minWidth}px`,
  minHeight: minHeight && `${minHeight}px`,
})

const GnoButton = ({ minWidth, minHeight, ...props }: Props) => {
  const style = calculateStyleBased(minWidth, minHeight)

  return <Button style={style} {...props} />
}

export default withStyles(styles)(GnoButton)
