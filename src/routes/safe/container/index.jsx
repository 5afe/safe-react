// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/safe/component/Layout'
import selector, { type SelectorProps } from './selector'

type Props = SelectorProps

class SafeView extends React.PureComponent<Props> {
  render() {
    const { safe, provider } = this.props

    return (
      <Page>
        <Layout provider={provider} safe={safe} />
      </Page>
    )
  }
}

export default connect(selector)(SafeView)
