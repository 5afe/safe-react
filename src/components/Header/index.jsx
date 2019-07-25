// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { WALLET_ERROR_MSG } from '~/logic/wallets/store/actions'
import Web3Integration from '~/logic/wallets/web3Integration'
import showSnackbarMsgAction from '~/components/Snackbar/store/actions/showSnackbarMsg'
import ProviderAccesible from './component/ProviderInfo/ProviderAccesible'
import UserDetails from './component/ProviderDetails/UserDetails'
import ProviderDisconnected from './component/ProviderInfo/ProviderDisconnected'
import ConnectDetails from './component/ProviderDetails/ConnectDetails'
import Layout from './component/Layout'
import selector, { type SelectorProps } from './selector'

type Props = SelectorProps & {
  showSnackbarMsg: (message: string, variant: string) => void,
}

type State = {
  hasError: boolean,
}


class HeaderComponent extends React.PureComponent<Props, State> {
  state = {
    hasError: false,
  }

  componentDidMount() {
    Web3Integration.resetWalletConnectSession()
    Web3Integration.checkForInjectedProvider()
  }

  componentDidCatch(error: Error, info: Info) {
    const { showSnackbarMsg } = this.props
    this.setState({ hasError: true })
    showSnackbarMsg(WALLET_ERROR_MSG, 'error')

    logComponentStack(error, info)
  }

  onDisconnect = () => {
    Web3Integration.disconnect()
  }

  getProviderInfoBased = () => {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    if (hasError || !loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderAccesible provider={provider} network={network} userAddress={userAddress} connected={available} />
  }

  getProviderDetailsBased = () => {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    if (hasError || !loaded) {
      return <ConnectDetails />
    }

    return (
      <UserDetails
        provider={provider}
        network={network}
        userAddress={userAddress}
        connected={available}
        onDisconnect={this.onDisconnect}
      />
    )
  }

  render() {
    const info = this.getProviderInfoBased()
    const details = this.getProviderDetailsBased()

    return <Layout providerInfo={info} providerDetails={details} />
  }
}

const Header = connect<Object, Object, ?Function, ?Object>(
  selector,
  {
    showSnackbarMsg: showSnackbarMsgAction,
  },
)(HeaderComponent)

export default Header
