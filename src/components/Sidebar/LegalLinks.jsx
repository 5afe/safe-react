// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import { sm, primary } from '~/theme/variables'
import { openCookieBanner } from '~/logic/cookies/store/actions/openCookieBanner'
import GnoButtonLink from '~/components/layout/ButtonLink'

const useStyles = makeStyles({
  container: {
    padding: `${sm} 0`,
  },
  link: {
    color: primary,
  },
  buttonLink: {
    textDecoration: 'none',
    color: primary,
  },
})

type Props = {
  toggleSidebar: Function,
}

const appVersion = `v${process.env.REACT_APP_APP_VERSION || ''}`

const LegalLinks = (props: Props) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const openCookiesHandler = () => {
    dispatch(openCookieBanner(true))
    props.toggleSidebar()
  }

  return (
    <Block className={classes.container} justify="space-around">
      <Link className={classes.link} to="https://safe.gnosis.io/terms" target="_blank">
        Terms
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/privacy" target="_blank">
        Privacy
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/licenses" target="_blank">
        Licenses
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/imprint" target="_blank">
        Imprint
      </Link>
      <GnoButtonLink className={classes.buttonLink} onClick={openCookiesHandler}>
        Cookies
      </GnoButtonLink>
      <Link className={classes.link} to="https://github.com/gnosis/safe-react/releases" target="_blank">
        {appVersion}
      </Link>
    </Block>
  )
}

export default LegalLinks
