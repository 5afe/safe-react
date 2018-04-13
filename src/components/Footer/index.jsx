// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import { WELCOME_ADDRESS, SAFELIST_ADDRESS } from '~/routes/routes'
import styles from './index.scss'

const Footer = () => (
  <Block className={styles.footer}>
    <Link padding="md" to={WELCOME_ADDRESS}>
      Welcome
    </Link>
    <Link to={SAFELIST_ADDRESS}>
      Safe List
    </Link>
  </Block>
)

export default Footer
