// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import ProviderInfo from './component/ProviderInfo'
import ProviderDetails from './component/ProviderInfo/UserDetails'
import ProviderDisconnected from './component/ProviderDisconnected'
import ConnectDetails from './component/ProviderDisconnected/ConnectDetails'
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

  getProviderInfoBased = (hasError, disconnected) => {
    if (hasError) {
      // return
    }

    if (disconnected) {
      return <ProviderDisconnected />
    }

    const {
      provider, network, userAddress, connected,
    } = this.props

    return <ProviderInfo provider={provider} network={network} userAddress={userAddress} connected={connected} />
  }

  getProviderDetailsBased = (hasError, disconnected) => {
    if (hasError) {
      // return
    }

    if (disconnected) {
      return <ConnectDetails />
    }

    const {
      provider, network, userAddress, connected,
    } = this.props

    return <ProviderDetails provider={provider} network={network} userAddress={userAddress} connected={connected} />
  }

  render() {
    const { connected } = this.props

    const { hasError } = this.state
    const providerDisconnected = !hasError && !connected

    const info = this.getProviderInfoBased(hasError, providerDisconnected)
    const details = this.getProviderDetailsBased(hasError, providerDisconnected)

    return <Layout providerInfo={info} providerDetails={details} />
  }
}

export default connect(selector, actions)(Header)
