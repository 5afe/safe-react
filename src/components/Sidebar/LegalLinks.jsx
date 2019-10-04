// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import { sm, primary } from '~/theme/variables'

const useStyles = makeStyles({
  container: {
    padding: `${sm} 0`,
  },
  link: {
    color: primary,
  },
})

const LegalLinks = () => {
  const classes = useStyles()
  return (
    <Block className={classes.container} justify="space-around">
      <Link className={classes.link} to="https://safe.gnosis.io/terms-of-use-072018.html" target="_blank">
        Terms
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/privacy-policy-052019.html" target="_blank">
        Privacy
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/licenses-092019.html" target="_blank">
        Licenses
      </Link>
      <Link className={classes.link} to="https://safe.gnosis.io/imprint.html" target="_blank">
        Imprint
      </Link>
    </Block>
  )
}

export default LegalLinks
