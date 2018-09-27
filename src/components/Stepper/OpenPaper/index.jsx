// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Block from '~/components/layout/Block'
import { lg } from '~/theme/variables'

const styles = () => ({
  root: {
    margin: '10px',
    maxWidth: '770px',
  },
  container: {
    maxWidth: '600px',
    letterSpacing: '-0.5px',
    padding: lg,
  },
})

type Props = {
  classes: Object,
  children: React$Node,
  controls: React$Node,
}

const OpenPaper = ({ classes, children, controls }: Props) => (
  <Paper className={classes.root} elevation={1}>
    <Block className={classes.container}>
      {children}
    </Block>
    { controls }
  </Paper>
)

export default withStyles(styles)(OpenPaper)
