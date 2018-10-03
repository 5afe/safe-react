// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Block from '~/components/layout/Block'
import { lg } from '~/theme/variables'

const styles = () => ({
  root: {
    margin: '10px',
    maxWidth: '870px',
  },
  container: {
    letterSpacing: '-0.5px',
  },
  padding: {
    padding: lg,
  },
})

type Props = {
  classes: Object,
  children: React$Node,
  controls: React$Node,
  padding?: boolean,
}

const OpenPaper = ({
  classes, children, controls, padding = true,
}: Props) => (
  <Paper className={classes.root} elevation={1}>
    <Block className={`${classes.container} ${padding ? classes.padding : ''}`}>
      {children}
    </Block>
    { controls }
  </Paper>
)

export default withStyles(styles)(OpenPaper)
