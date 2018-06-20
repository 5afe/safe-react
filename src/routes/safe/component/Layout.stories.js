// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
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
      balance="0"
      fetchBalance={() => {}}
    />
  ))
  .add('Safe undefined NOT connected', () => (
    <Component
      userAddress="foo"
      safe={undefined}
      provider=""
      balance="0"
      fetchBalance={() => {}}
    />
  ))
  .add('Safe with 2 owners and 10ETH as dailyLimit', () => {
    const safe = SafeFactory.dailyLimitSafe(10, 1.345)

    return (
      <Component
        userAddress="foo"
        safe={safe}
        provider="METAMASK"
        balance="2"
        fetchBalance={() => {}}
      />
    )
  })
  .add('Safe with dailyLimit reached', () => {
    const safe = SafeFactory.dailyLimitSafe(10, 10)

    return (
      <Component
        userAddress="foo"
        safe={safe}
        provider="METAMASK"
        balance="2"
        fetchBalance={() => {}}
      />
    )
  })
