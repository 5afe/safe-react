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
  loaded: boolean,
  available: boolean,
}

type State = {
  hasError: boolean,
}

const getProviderInfoBased = (hasError, loaded, available, provider, network, userAddress) => {
  if (hasError || !loaded) {
    return <ProviderDisconnected />
  }

  return <ProviderInfo provider={provider} network={network} userAddress={userAddress} connected={available} />
}

const getProviderDetailsBased = (hasError, loaded, available, provider, network, userAddress) => {
  if (hasError || !loaded) {
    return <ConnectDetails />
  }

  return <ProviderDetails provider={provider} network={network} userAddress={userAddress} connected={available} />
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

  render() {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    const info = getProviderInfoBased(hasError, loaded, available, provider, network, userAddress)
    const details = getProviderDetailsBased(hasError, loaded, available, provider, network, userAddress)

    return <Layout providerInfo={info} providerDetails={details} />
  }
}

export default connect(selector, actions)(Header)
