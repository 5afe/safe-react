// @flow
import { storiesOf } from '@storybook/react'
import { List } from 'immutable'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import { SafeFactory } from '~/routes/safe/store/test/builder/index.builder'
import Component from './Layout'


const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Routes /safe', module)
  .addDecorator(FrameDecorator)
  .add('Safe List whithout safes', () => <Component safes={List([])} />)
  .add('Safe List whith 2 safes', () => {
    const safes = List([SafeFactory.oneOwnerSafe, SafeFactory.twoOwnersSafe])
    return (
      <Component safes={safes} />
    )
  })
