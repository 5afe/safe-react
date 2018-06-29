// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Map } from 'immutable'
import styles from '~/components/layout/PageFrame/index.scss'
import { SafeFactory } from '~/routes/safe/store/test/builder/safe.builder'
import { makeBalance } from '~/routes/safe/store/model/balance'
import Component from './Layout'


const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

const ethBalance = makeBalance({
  address: '0',
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
  logoUrl: 'assets/icons/icon_etherTokens.svg',
  funds: '2',
})

storiesOf('Routes /safe:address', module)
  .addDecorator(FrameDecorator)
  .add('Safe undefined being connected', () => (
    <Component
      userAddress="foo"
      safe={undefined}
      provider="METAMASK"
      balances={Map()}
      fetchBalance={() => {}}
    />
  ))
  .add('Safe undefined NOT connected', () => (
    <Component
      userAddress="foo"
      safe={undefined}
      provider=""
      balances={Map()}
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
        balances={Map().set('ETH', ethBalance)}
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
        balances={Map().set('ETH', ethBalance)}
        fetchBalance={() => {}}
      />
    )
  })
