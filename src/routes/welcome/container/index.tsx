import * as React from 'react'
import { connect } from 'react-redux'

import Layout from '../components/Layout'

import selector from './selector'

import Page from 'src/components/layout/Page'

const Welcome = ({ provider }) => (
  <Page align="center">
    <Layout provider={provider} />
  </Page>
)

export default connect(selector)(Welcome)
