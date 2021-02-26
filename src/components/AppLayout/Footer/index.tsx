import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'

import Link from 'src/components/layout/Link'
import { screenSm, secondary, sm } from 'src/theme/variables'

const useStyles = makeStyles({
  footer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '1',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: '100%',
    padding: `20px ${sm} 20px`,
    width: `${screenSm}px`,
  },
  item: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '13px',
  },
  link: {
    color: secondary,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
  sep: {
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0 10px',
  },
  buttonLink: {
    padding: '0',
  },
} as any)

const Footer = (): React.ReactElement => {
  const date = new Date()
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <span className={classes.item}>©{date.getFullYear()} Hosted by Binance</span>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target="_blank" to="https://www.binance.org/en/terms">
        Terms
      </Link>
    </footer>
  )
}

export default Footer
