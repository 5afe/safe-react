// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Block from '~/components/layout/Block'
import { lg } from '~/theme/variables'

const styles = () => ({
  root: {
    padding: lg,
    maxWidth: '770px',
    borderBottomRightRadius: '0px',
    borderBottomLeftRadius: '0px',
  },
  container: {
    maxWidth: '600px',
    letterSpacing: '-0.5px',
  },
})

type Props = {
  classes: Object,
  children: React$Node,
}

const OpenPaper = ({ classes, children }: Props) => (
  <Paper className={classes.root} elevation={1}>
    <Block className={classes.container}>
      {children}
    </Block>
  </Paper>
)

export default withStyles(styles)(OpenPaper)
