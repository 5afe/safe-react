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
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
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
  container?: number,
  padding?: boolean,
}

const generateContainerStyleFrom = (container?: number) => ({
  maxWidth: container ? `${container}px` : undefined,
})

const OpenPaper = ({
  classes, children, controls, container, padding = true,
}: Props) => {
  const containerStyle = generateContainerStyleFrom(container)

  return (
    <Paper className={classes.root} elevation={1}>
      <Block style={containerStyle} className={`${classes.container} ${padding ? classes.padding : ''}`}>
        {children}
      </Block>
      { controls }
    </Paper>
  )
}

export default withStyles(styles)(OpenPaper)
