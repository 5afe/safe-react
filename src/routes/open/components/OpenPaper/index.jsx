// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'

const styles = () => ({
  root: {
    margin: '10px',
    maxWidth: '770px',
  },
})

type Props = {
  classes: Object,
  children: React$Node,
}

const OpenPaper = ({ classes, children }: Props) => (
  <Paper className={classes.root} elevation={1}>
    {children}
  </Paper>
)

export default withStyles(styles)(OpenPaper)
