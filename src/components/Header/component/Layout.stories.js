// @flow
import { select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './Layout'

const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('Header', () => {
    // https://github.com/storybooks/storybook/tree/master/addons/knobs#select
    const provider = select('Status by Provider', ['', 'UNKNOWN', 'METAMASK', 'PARITY'], 'METAMASK')
    return <Component provider={provider} reloadWallet={() => {}} />
  })
