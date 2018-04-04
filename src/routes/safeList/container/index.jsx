// @flow
import { List } from 'immutable'
import * as React from 'react'
import { connect } from 'react-redux'
import PageFrame from '~/components/layout/PageFrame'
import { type Safe } from '~/routes/safe/store/model/safe'
import Layout from '../components/Layout'
import selector from './selector'

type Props = {
  safes: List<Safe>
}

const SafeList = ({ safes }: Props) => (
  <PageFrame>
    <Layout safes={safes} />
  </PageFrame>
)

export default connect(selector)(SafeList)
