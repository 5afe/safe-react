// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { WALLET_ERROR_MSG } from '~/logic/wallets/store/actions'
import { getProviderInfo } from '~/logic/wallets/getWeb3'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import ProviderAccesible from './component/ProviderInfo/ProviderAccesible'
import UserDetails from './component/ProviderDetails/UserDetails'
import ProviderDisconnected from './component/ProviderInfo/ProviderDisconnected'
import ConnectDetails from './component/ProviderDetails/ConnectDetails'
import Layout from './component/Layout'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'

type Variant = 'success' | 'error' | 'warning' | 'info'

type Props = Actions &
  SelectorProps & {
    enqueueSnackbar: (message: string, variant: Variant) => void,
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
    this.onConnect()
  }

  componentDidCatch(error: Error, info: Info) {
    const { enqueueSnackbar } = this.props

    this.setState({ hasError: true })
    enqueueSnackbar(WALLET_ERROR_MSG, 'error')

    logComponentStack(error, info)
  }

  onDisconnect = () => {
    const { removeProvider, enqueueSnackbar } = this.props

    clearInterval(this.providerListener)

    removeProvider(enqueueSnackbar)
  }

  onConnect = async () => {
    const { fetchProvider, enqueueSnackbar } = this.props

    clearInterval(this.providerListener)
    let currentProvider: ProviderProps = await getProviderInfo()
    fetchProvider(currentProvider, enqueueSnackbar)

    this.providerListener = setInterval(async () => {
      const newProvider: ProviderProps = await getProviderInfo()
      if (JSON.stringify(currentProvider) !== JSON.stringify(newProvider)) {
        fetchProvider(newProvider, enqueueSnackbar)
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

    return <ProviderAccesible provider={provider} network={network} userAddress={userAddress} connected={available} />
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
