// @flow
import { withSnackbar } from 'notistack'
import * as React from 'react'
import { connect } from 'react-redux'

import actions, { type Actions } from './actions'
import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import UserDetails from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import selector, { type SelectorProps } from './selector'

import { onboard } from '~/components/ConnectButton'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
import { loadLastUsedProvider } from '~/logic/wallets/store/middlewares/providerWatcher'
import { type Info, logComponentStack } from '~/utils/logBoundaries'

type Props = Actions &
  SelectorProps & {
    enqueueSnackbar: Function,
    closeSnackbar: Function,
  }

type State = {
  hasError: boolean,
}

class HeaderComponent extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  async componentDidMount() {
    const lastUsedProvider = await loadLastUsedProvider()
    if (lastUsedProvider) {
      const hasSelectedWallet = await onboard.walletSelect(lastUsedProvider)
      if (hasSelectedWallet) {
        await onboard.walletCheck()
      }
    }
  }

  componentDidCatch(error: Error, info: Info) {
    const { closeSnackbar, enqueueSnackbar } = this.props

    this.setState({ hasError: true })
    showSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG, enqueueSnackbar, closeSnackbar)

    logComponentStack(error, info)
  }

  getOpenDashboard = () => {
    const { wallet } = onboard.getState()
    return wallet.type === 'sdk' && wallet.dashboard
  }
  onDisconnect = () => {
    const { closeSnackbar, enqueueSnackbar, removeProvider } = this.props

    removeProvider(enqueueSnackbar, closeSnackbar)
  }

  getProviderInfoBased = () => {
    const { hasError } = this.state
    const { available, loaded, network, provider, userAddress } = this.props

    if (hasError || !loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible connected={available} network={network} provider={provider} userAddress={userAddress} />
  }

  getProviderDetailsBased = () => {
    const { hasError } = this.state
    const { available, loaded, network, provider, userAddress } = this.props

    if (hasError || !loaded) {
      return <ConnectDetails />
    }

    return (
      <UserDetails
        connected={available}
        network={network}
        onDisconnect={this.onDisconnect}
        openDashboard={this.getOpenDashboard()}
        provider={provider}
        userAddress={userAddress}
      />
    )
  }

  render() {
    const info = this.getProviderInfoBased()
    const details = this.getProviderDetailsBased()

    return <Layout providerDetails={details} providerInfo={info} />
  }
}

export default connect(selector, actions)(withSnackbar(HeaderComponent))
