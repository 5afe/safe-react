// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import { NOTIFICATIONS, showSnackbar } from '~/logic/notifications'
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
  providerListener: ?IntervalID

  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
    }
  }

  componentDidMount() {
    // this.onConnect()
  }

  componentDidCatch(error: Error, info: Info) {
    const { enqueueSnackbar, closeSnackbar } = this.props

    this.setState({ hasError: true })
    showSnackbar(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG, enqueueSnackbar, closeSnackbar)

    logComponentStack(error, info)
  }

  onDisconnect = () => {
    const { removeProvider, enqueueSnackbar, closeSnackbar } = this.props

    clearInterval(this.providerListener)

    removeProvider(enqueueSnackbar, closeSnackbar)
  }

  onConnect = async () => {
    const { fetchProvider, enqueueSnackbar, closeSnackbar } = this.props

    clearInterval(this.providerListener)
    let currentProvider: ProviderProps = await getProviderInfo()
    fetchProvider(currentProvider, enqueueSnackbar, closeSnackbar)

    this.providerListener = setInterval(async () => {
      const newProvider: ProviderProps = await getProviderInfo()
      if (currentProvider && JSON.stringify(currentProvider) !== JSON.stringify(newProvider)) {
        fetchProvider(newProvider, enqueueSnackbar, closeSnackbar)
      }
      currentProvider = newProvider
    }, 2000)
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
      return <ConnectDetails onConnect={this.onConnect} />
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
