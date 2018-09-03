// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import Provider from './component/Provider'
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

type State = {
  hasError: boolean,
}

class Header extends React.PureComponent<Props, State> {
  state = {
    hasError: false,
  }

  componentDidMount() {
    this.props.fetchProvider()
  }

  componentDidCatch(error: Error, info: Info) {
    this.setState({ hasError: true })

    logComponentStack(error, info)
  }

  reloadWallet = () => {
    this.props.fetchProvider()
  }

  render() {
    const {
      provider, userAddress, network, connected,
    } = this.props

    const { hasError } = this.state

    // const providerDisconnected = !hasError && !connected
    const providerConnected = !hasError && connected

    return (
      <Layout
        reloadWallet={this.reloadWallet}
      >
        {/* hasError && <ProviderError /> */}
        {/* providerDisconnected && <ProviderDisconnected /> */}
        { providerConnected &&
          <Provider
            provider={provider}
            userAddress={userAddress}
            network={network}
            connected={connected}
          />
        }
      </Layout>
    )
  }
}

export default connect(selector, actions)(Header)
