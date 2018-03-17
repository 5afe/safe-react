// @flow
import { select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Block from '~/components/layout/Block'
import styles from '~/components/layout/PageFrame/index.scss'
import Component from './index'

const FrameDecorator = story => (
  <Block className={styles.frame}>
    { story() }
  </Block>
)

storiesOf('Components', module)
  .addDecorator(FrameDecorator)
  .add('Header', () => {
    // https://github.com/storybooks/storybook/tree/master/addons/knobs#select
    const provider = select('Status by Provider', ['', 'METAMASK', 'PARITY'], 'METAMASK')
    return <Component provider={provider} />
  })
