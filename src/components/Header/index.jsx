// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
import { web3Connect } from '~/components/ConnectButton'
import { INJECTED_PROVIDERS } from '~/logic/wallets/getWeb3'
import { loadLastUsedProvider } from '~/logic/wallets/store/middlewares/providerWatcher'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import UserDetails from './components/ProviderDetails/UserDetails'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import Layout from './components/Layout'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'

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
    if (INJECTED_PROVIDERS.includes(lastUsedProvider) || process.env.NODE_ENV === 'test') {
      web3Connect.connectToInjected()
    }
  }

  componentDidCatch(error: Error, info: Info) {
    const { enqueueSnackbar, closeSnackbar } = this.props

    this.setState({ hasError: true })
    showSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG, enqueueSnackbar, closeSnackbar)

    logComponentStack(error, info)
  }

  onDisconnect = () => {
    const { removeProvider, enqueueSnackbar, closeSnackbar } = this.props

    removeProvider(enqueueSnackbar, closeSnackbar)
  }

  getProviderInfoBased = () => {
    const { hasError } = this.state
    const {
      loaded, available, provider, network, userAddress,
    } = this.props

    if (hasError || !loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible provider={provider} network={network} userAddress={userAddress} connected={available} />
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

export default connect(
  selector,
  actions,
)(withSnackbar(HeaderComponent))
