// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import { makeDailyLimit, type DailyLimit } from '~/routes/safe/store/model/dailyLimit'
import Component from './index'


const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('WitdrawnForm', () => {
    const dailyLimit: DailyLimit = makeDailyLimit({ value: 10, spentToday: 6 })

    return (
      <Component dailyLimit={dailyLimit} safeAddress="" />
    )
  })
