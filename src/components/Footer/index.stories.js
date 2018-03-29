// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Component from './index'

storiesOf('Components', module)
  .addDecorator(host({
    title: 'Footer',
    align: 'center',
    height: 250,
    width: '100%',
  }))
  .add('Footer', () => <Component />)
