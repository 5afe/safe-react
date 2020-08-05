import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Block from 'src/components/layout/Block'
import { lg } from 'src/theme/variables'

const useStyles = makeStyles({
  root: {
    margin: '10px',
    maxWidth: '770px',
    boxShadow: '0 0 10px 0 rgba(33,48,77,0.10)',
  },
  padding: {
    padding: lg,
  },
})

interface Props {
  padding?: boolean
  controls: React.ReactNode
}

const OpenPaper: React.FC<Props> = ({ children, controls, padding = true }) => {
  const classes = useStyles()

  return (
    <Paper className={classes.root} elevation={1}>
      <Block className={padding ? classes.padding : ''}>{children}</Block>
      {controls}
    </Paper>
  )
}

export default OpenPaper
