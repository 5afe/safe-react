// @flow
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import Component from './Layout'

storiesOf('Routes', module)
  .add('Welcome with Metamask connected', () => (
    <Component
      provider="METAMASK"
      fetchProvider={() => { }}
    />
  ))
  .add('Welcome with Parity connected', () => (
    <Component
      provider="PARITY"
      fetchProvider={() => { }}
    />
  ))
  .add('Welcome without provider', () => (
    <Component
      provider=""
      fetchProvider={() => { }}
    />
  ))
