// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/tokens/component/Layout'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps

class TokensView extends React.PureComponent<Props> {
  render() {
    const {
      tokens, addresses, safe, disableToken, enableToken,
    } = this.props

    return (
      <Page>
        <Layout
          tokens={tokens}
          addresses={addresses}
          safe={safe}
          disableToken={disableToken}
          enableToken={enableToken}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(TokensView)
