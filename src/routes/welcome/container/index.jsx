// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Layout from '../components/Layout'
import selector from './selector'

type Props = {
  provider: string
}

const Welcome = ({ provider }: Props) => (
  <Layout provider={provider} />
)

export default connect(selector)(Welcome)
