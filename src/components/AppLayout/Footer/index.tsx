import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import AppstoreButton from 'src/components/AppstoreButton'

import GnoButtonLink from 'src/components/layout/ButtonLink'
import Link from 'src/components/layout/Link'
import { openCookieBanner } from 'src/logic/cookies/store/actions/openCookieBanner'
import { secondary, sm } from 'src/theme/variables'

const useStyles = makeStyles({
  footer: {
    boxSizing: 'border-box',
    background: '#000',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '1',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    maxWidth: '100%',
    paddingBottom: '1rem',
    width: '100%',
    height: '59px',
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
  const classes = useStyles()
  const dispatch = useDispatch()

  const openCookiesHandler = () => {
    dispatch(openCookieBanner({ cookieBannerOpen: true }))
  }

  return (
    <footer className={classes.footer}>
      <p>Powered by Neobase</p>
    </footer>
  )
}

export default Footer
