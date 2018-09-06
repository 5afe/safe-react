// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import ProviderInfo from './component/ProviderInfo'
import ProviderDetails from './component/ProviderInfo/UserDetails'
import ProviderDisconnected from './component/ProviderDisconnected'
import ConnectDetails from './component/ProviderDisconnected/ConnectDetails'
import Layout from './component/Layout'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'

type Props = Actions & SelectorProps

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

  onDisconnect = () => {
    this.props.removeProvider()
  }

  onConnect = () => {
    this.props.fetchProvider()
  }

  getProviderInfoBased = () => {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    if (hasError || !loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderInfo provider={provider} network={network} userAddress={userAddress} connected={available} />
  }

  getProviderDetailsBased = () => {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    if (hasError || !loaded) {
      return <ConnectDetails onConnect={this.onConnect} />
    }

    return (<ProviderDetails
      provider={provider}
      network={network}
      userAddress={userAddress}
      connected={available}
      onDisconnect={this.onDisconnect}
    />)
  }

  render() {
    const info = this.getProviderInfoBased()
    const details = this.getProviderDetailsBased()

    return <Layout providerInfo={info} providerDetails={details} />
  }
}

export default connect(selector, actions)(Header)
