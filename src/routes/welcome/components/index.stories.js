// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Component from './Layout'

storiesOf('Routes', module)
  .addDecorator(host({
    title: 'Routes - Welcome',
    align: 'center',
    height: '100%',
    width: '100%',
  }))
  .add('Welcome', () => <Component />)
