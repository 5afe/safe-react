// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/tokens/component/Layout'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps & {
  safeAddress: string,
  fetchTokens: typeof fetchTokens,
}

class TokensView extends React.PureComponent<Props> {
  componentDidUpdate() {
    const { safeAddress } = this.props

    if (this.props.tokens.count() === 0) {
      this.props.fetchTokens(safeAddress)
    }
  }

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
