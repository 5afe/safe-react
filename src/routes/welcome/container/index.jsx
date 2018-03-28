// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import PageFrame from '~/components/layout/PageFrame'
import Layout from '../components/Layout'
import selector from './selector'

type Props = {
  provider: string
}

const Welcome = ({ provider }: Props) => (
  <PageFrame align="center">
    <Layout provider={provider} />
  </PageFrame>
)

export default connect(selector)(Welcome)
