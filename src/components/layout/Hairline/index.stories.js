// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { host } from 'storybook-host'
import Component from './index'

storiesOf('Components', module)
  .addDecorator(
    host({
      title: 'Hairline',
      align: 'center',
      height: 5,
      width: '100%',
    }),
  )
  .add('Hairline', () => <Component />)
