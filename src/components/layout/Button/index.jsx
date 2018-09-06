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
  minWidth?: number
}

const calculateStyleBased = minWidth => ({
  minWidth: `${minWidth}px`,
})

const GnoButton = ({ minWidth, ...props }: Props) => {
  const style = minWidth ? calculateStyleBased(minWidth) : undefined

  return <Button style={style} {...props} />
}

export default withStyles(styles)(GnoButton)
