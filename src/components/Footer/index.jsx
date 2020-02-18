// @flow
import * as React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import cn from 'classnames'
import Link from '~/components/layout/Link'
import { secondary, screenSm, sm } from '~/theme/variables'
import { openCookieBanner } from '~/logic/cookies/store/actions/openCookieBanner'
import GnoButtonLink from '~/components/layout/ButtonLink'

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
    padding: `40px ${sm} 20px`,
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
})

const appVersion = process.env.REACT_APP_APP_VERSION ? `v${process.env.REACT_APP_APP_VERSION} ` : 'Versions'

const Footer = () => {
  const date = new Date()
  const classes = useStyles()
  const dispatch = useDispatch()

  const openCookiesHandler = () => {
    dispatch(openCookieBanner(true))
  }

  return (
    <footer className={classes.footer}>
      <span className={classes.item}>©{date.getFullYear()} Gnosis</span>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} to="https://safe.gnosis.io/terms" target="_blank">
        Terms
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} to="https://safe.gnosis.io/privacy" target="_blank">
        Privacy
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} to="https://safe.gnosis.io/licenses" target="_blank">
        Licenses
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} to="https://safe.gnosis.io/imprint" target="_blank">
        Imprint
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} to="https://safe.gnosis.io/cookie" target="_blank">
        Cookie Policy
      </Link>
      <span className={classes.sep}>-</span>
      <GnoButtonLink className={cn(classes.item, classes.link, classes.buttonLink)} onClick={openCookiesHandler}>
        Preferences
      </GnoButtonLink>
      <span className={classes.sep}>|</span>
      <Link
        className={cn(classes.item, classes.link)}
        to="https://github.com/gnosis/safe-react/releases"
        target="_blank"
      >
        {appVersion}
      </Link>
    </footer>
  )
}

export default Footer
