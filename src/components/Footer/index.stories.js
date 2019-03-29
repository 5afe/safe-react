// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './index'

const FrameDecorator = story => (
  <div className={styles.frame}>
    <div style={{ flex: '1' }} />
    {story()}
  </div>
)

storiesOf('Components /Footer', module)
  .addDecorator(FrameDecorator)
  .add('Loaded', () => <Component />)
