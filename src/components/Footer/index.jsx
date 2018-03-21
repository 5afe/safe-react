// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import styles from './index.scss'

const Footer = () => (
  <Block className={styles.footer}>
    <Link to="/welcome">
      Welcome
    </Link>
  </Block>
)

export default Footer
