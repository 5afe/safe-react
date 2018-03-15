// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import { screenLg } from '~/theme/variables'
import Component from './Layout'

storiesOf('Routes', module)
  .addDecorator(host({
    title: 'Routes - Welcome',
    align: 'center',
    height: '100%',
    width: `${screenLg}px`,
  }))
  .add('Welcome', () => <Component />)
