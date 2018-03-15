// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import styles from './index.scss'

const Footer = () => (
  <Block className={styles.footer}>
    <Link to="/wallet">
      Wallet
    </Link>
    <Link to="/transactions">
      Transactions
    </Link>
    <Link to="/settings">
      Settings
    </Link>
  </Block>
)

export default Footer
