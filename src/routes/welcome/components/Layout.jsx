// @flow
import React from 'react'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import { OPEN_ADDRESS, SAFELIST_ADDRESS } from '~/routes/routes'
import styles from './Layout.scss'

const vault = require('../assets/vault.svg')

type Props = {
  provider: string
}

type SafeProps = {
  size?: 'small' | 'medium',
}

export const CreateSafe = ({ size }: SafeProps) => (
  <Link to={OPEN_ADDRESS}>
    <Button variant="raised" size={size || 'medium'} color="primary">
      Create a new Safe
    </Button>
  </Link>
)

const Welcome = ({ provider }: Props) => (
  <Block className={styles.safe}>
    <Img alt="Safe Box" src={vault} height={330} />
    <Block className={styles.safeActions} margin="md">
      { provider && <CreateSafe /> }
      <Link to={SAFELIST_ADDRESS}>
        <Button variant="raised" color="primary">
          See Safe list
        </Button>
      </Link>
    </Block>
  </Block>
)

export default Welcome
