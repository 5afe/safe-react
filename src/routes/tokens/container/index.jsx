// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Page from '~/components/layout/Page'
import Layout from '~/routes/tokens/component/Layout'
import { fetchTokens } from '~/routes/tokens/store/actions/fetchTokens'
import selector, { type SelectorProps } from './selector'
import actions, { type Actions } from './actions'

type Props = Actions & SelectorProps & {
  fetchTokens: typeof fetchTokens,
}

class TokensView extends React.PureComponent<Props> {
  componentDidUpdate() {
    const { safeAddress, tokens, fetchTokens: loadTokens } = this.props

    if (tokens.count() === 0) {
      loadTokens(safeAddress)
    }
  }

  render() {
    const {
      tokens, addresses, safe, safeAddress, disableToken, enableToken, addToken, removeToken,
    } = this.props

    return (
      <Page>
        <Layout
          tokens={tokens}
          addresses={addresses}
          safe={safe}
          safeAddress={safeAddress}
          disableToken={disableToken}
          enableToken={enableToken}
          addToken={addToken}
          removeToken={removeToken}
        />
      </Page>
    )
  }
}

export default connect(selector, actions)(TokensView)
