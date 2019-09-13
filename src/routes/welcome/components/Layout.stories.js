// @flow
import { select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './Layout'

const FrameDecorator = (story) => <div className={styles.frame}>{story()}</div>

storiesOf('Routes /welcome', module)
  .addDecorator(FrameDecorator)
  .add('Welcome with Gnosis Safe connected', () => {
    const provider = select('Status by Provider', ['', 'UNKNOWN', 'SAFE', 'METAMASK', 'PARITY'], 'SAFE')
    return <Component provider={provider} fetchProvider={() => {}} />
  })
  .add('Welcome with Metamask connected', () => {
    const provider = select('Status by Provider', ['', 'UNKNOWN', 'SAFE', 'METAMASK', 'PARITY'], 'METAMASK')
    return <Component provider={provider} fetchProvider={() => {}} />
  })
  .add('Welcome with unknown wallet', () => {
    const provider = select('Status by Provider', ['', 'UNKNOWN', 'SAFE', 'METAMASK', 'PARITY'], 'UNKNOWN')
    return <Component provider={provider} fetchProvider={() => {}} />
  })
  .add('Welcome without wallet connected', () => {
    const provider = select('Status by Provider', ['', 'UNKNOWN', 'SAFE', 'METAMASK', 'PARITY'], '')
    return <Component provider={provider} fetchProvider={() => {}} />
  })
