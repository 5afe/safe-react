// @flow
import { storiesOf } from '@storybook/react'
import { List } from 'immutable'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './Layout'

const FrameDecorator = story => <div className={styles.frame}>{story()}</div>

storiesOf('Routes /safes', module)
  .addDecorator(FrameDecorator)
  .add('Safe List whithout safes and connected', () => <Component provider="METAMASK" safes={List([])} />)
  .add('Safe List whithout safes and NOT connected', () => <Component provider="" safes={List([])} />)
