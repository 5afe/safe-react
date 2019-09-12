// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import Component from './component'

const FrameDecorator = (story) => <div className={styles.frame}>{story()}</div>

storiesOf('Routes /opening', module)
  .addDecorator(FrameDecorator)
  .add('View while safe is being deployed', () => (
    <Component
      name="Super Vault 2000"
      tx="0xed163e50e2e85695f5edafeba51d6be1758549858d12611ed4dcc96feaa19fc9"
      network={ETHEREUM_NETWORK.RINKEBY}
    />
  ))
  .add('Load this view without a tx', () => <Component network={ETHEREUM_NETWORK.UNKNOWN} />)
