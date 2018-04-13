// @flow
import * as React from 'react'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Link from '~/components/layout/Link'
import { OPEN_ADDRESS } from '~/routes/routes'
import styles from './Layout.scss'

const vault = require('../assets/vault.svg')

type Props = {
  provider: string
}

type SafeProps = {
  provider: string,
  size?: 'small' | 'medium',
}

export const CreateSafe = ({ size, provider }: SafeProps) => (
  <Button
    variant="raised"
    size={size || 'medium'}
    color="primary"
    disabled={!provider}
  >
    <Link to={OPEN_ADDRESS} color="white">Create a new Safe</Link>
  </Button>
)


const Welcome = ({ provider }: Props) => (
  <Block className={styles.safe}>
    <Img alt="Safe Box" src={vault} height={330} />
    <Block className={styles.safeActions} margin="md">
      <CreateSafe provider={provider} />
    </Block>
  </Block>
)

export default Welcome
