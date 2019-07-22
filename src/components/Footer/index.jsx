// @flow
import React from 'react'
import { connect } from 'react-redux'
import { providerNameSelector } from '~/logic/wallets/store/selectors'
import Block from '~/components/layout/Block'
import Link from '~/components/layout/Link'
import Paragraph from '~/components/layout/Paragraph'
import { WELCOME_ADDRESS, SAFELIST_ADDRESS } from '~/routes/routes'
import styles from './index.scss'

type Props = {
  provider?: string,
}

const Footer = ({ provider }: Props) => (
  <Block className={styles.footer}>
    {provider && (
      <Link to={WELCOME_ADDRESS}>
        <Paragraph size="sm" color="primary" noMargin>
          Add Safe
        </Paragraph>
      </Link>
    )}
    {provider && (
      <Link to={SAFELIST_ADDRESS}>
        <Paragraph size="sm" color="primary" noMargin>
          Safe List
        </Paragraph>
      </Link>
    )}
  </Block>
)

export default connect(
  state => ({
    provider: providerNameSelector(state),
  }),
  null,
)(Footer)
