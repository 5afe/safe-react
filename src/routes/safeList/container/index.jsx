// @flow
import { List } from 'immutable'
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import { type Safe } from '~/routes/safe/store/model/safe'
import Layout from '../components/Layout'
import selector from './selector'

type Props = {
  safes: List<Safe>,
  provider: string,
}

const SafeList = ({ safes, provider }: Props) => (
  <Page>
    <Layout safes={safes} provider={provider} />
  </Page>
)

export default connect<*, *, *, *>(selector)(SafeList)
