// @flow
import * as React from 'react'
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
  provider: string,
  size?: 'small' | 'medium',
}

type SafeButtonProps = {
  disabled: boolean,
  size?: 'small' | 'medium',
}

const SafeButton = ({ size, disabled }: SafeButtonProps) => (
  <Button
    variant="raised"
    size={size || 'medium'}
    color="primary"
    disabled={disabled}
  >
    Create a new Safe
  </Button>
)
export const CreateSafe = ({ size, provider }: SafeProps) => (
  <React.Fragment>
    { provider
      ? <Link to={OPEN_ADDRESS}><SafeButton size={size} disabled={false} /></Link>
      : <SafeButton size={size} disabled />
    }
  </React.Fragment>
)


const Welcome = ({ provider }: Props) => (
  <Block className={styles.safe}>
    <Img alt="Safe Box" src={vault} height={330} />
    <Block className={styles.safeActions} margin="md">
      <CreateSafe provider={provider} />
      <Link to={SAFELIST_ADDRESS}>
        <Button variant="raised" color="primary">
          See Safe list
        </Button>
      </Link>
    </Block>
  </Block>
)

export default Welcome
