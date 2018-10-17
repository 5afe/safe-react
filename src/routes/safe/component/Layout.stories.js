// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { List } from 'immutable'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './Layout'


const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Routes /safe:address', module)
  .addDecorator(FrameDecorator)
  .add('Safe undefined being connected', () => (
    <Component
      userAddress="foo"
      safe={undefined}
      provider="METAMASK"
      activeTokens={List([])}
      fetchBalance={() => {}}
    />
  ))
  .add('Safe undefined NOT connected', () => (
    <Component
      userAddress="foo"
      safe={undefined}
      provider=""
      activeTokens={List([])}
      fetchBalance={() => {}}
    />
  ))
