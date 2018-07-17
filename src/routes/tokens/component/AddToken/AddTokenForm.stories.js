// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { List } from 'immutable'
import styles from '~/components/layout/PageFrame/index.scss'
import AddTokenForm from './index'

const FrameDecorator = story => (
  <div className={styles.frame} style={{ textAlign: 'center' }}>
    { story() }
  </div>
)
storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('AddTokenForm', () => (
    <AddTokenForm tokens={List([]).toArray()} safeAddress="" />
  ))
