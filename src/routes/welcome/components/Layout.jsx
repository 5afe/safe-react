// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import PageFrame from '~/components/layout/PageFrame'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import styles from './Layout.scss'

const vault = require('../assets/vault.svg')

const Welcome = () => (
  <PageFrame>
    <Block className={styles.safe}>
      <Img src={vault} height={330} />
      <Block className={styles.safeActions}>
        <Link to="/transactions">
          <Button variant="raised" color="primary">
            Create a new Safe
          </Button>
        </Link>
        <Link to="/transactions">
          <Button variant="raised" color="primary">
            Open a Safe
          </Button>
        </Link>
      </Block>
    </Block>
  </PageFrame>
)

export default Welcome
