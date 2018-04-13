// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './index'

const FrameDecorator = story => (
  <div className={styles.frame}>
    { story() }
  </div>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('Loader', () => <Component />)
