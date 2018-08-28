// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import Layout from './component/Layout'
import actions from './actions'
import selector from './selector'

type Props = {
  provider: string,
  fetchProvider: Function,
  userAddress: string,
  network: string,
  connected: boolean,
}

class Header extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchProvider()
  }

  reloadWallet = () => {
    this.props.fetchProvider()
  }

  render() {
    const {
      provider, userAddress, network, connected,
    } = this.props

    return (
      <Layout
        provider={provider}
        reloadWallet={this.reloadWallet}
        userAddress={userAddress}
        network={network}
        connected={connected}
      />
    )
  }
}

export default connect(selector, actions)(Header)
