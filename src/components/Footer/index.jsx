// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import { WELCOME_ADDRESS, SAFELIST_ADDRESS } from '~/routes/routes'
import styles from './index.scss'

const Footer = () => (
  <Block className={styles.footer}>
    <Link to={WELCOME_ADDRESS}>
      <Paragraph size="sm" color="primary" noMargin>Add Safe</Paragraph>
    </Link>
    <Link to={SAFELIST_ADDRESS}>
      <Paragraph size="sm" color="primary" noMargin>Safe List</Paragraph>
    </Link>
  </Block>
)

export default Footer
