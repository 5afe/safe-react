// @flow
import * as React from 'react'
import { connect } from 'react-redux'

import Layout from '../components/Layout'

import selector from './selector'

import Page from '~/components/layout/Page'

type Props = {
  provider: string,
}

const Welcome = ({ provider }: Props) => (
  <Page align="center">
    <Layout provider={provider} />
  </Page>
)

export default connect(selector)(Welcome)
