// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { SharedSnackbarConsumer, type Variant } from '~/components/SharedSnackBar'
import { WALLET_ERROR_MSG } from '~/logic/wallets/store/actions'
import Web3Integration from '~/logic/wallets/web3Integration'
import type { ProviderProps } from '~/logic/wallets/store/model/provider'
import ProviderAccesible from './component/ProviderInfo/ProviderAccesible'
import UserDetails from './component/ProviderDetails/UserDetails'
import ProviderDisconnected from './component/ProviderInfo/ProviderDisconnected'
import ConnectDetails from './component/ProviderDetails/ConnectDetails'
import Layout from './component/Layout'
import actions, { type Actions } from './actions'
import selector, { type SelectorProps } from './selector'

type Props = Actions &
  SelectorProps & {
    openSnackbar: (message: string, variant: Variant) => void,
  }

type State = {
  hasError: boolean,
}

class HeaderComponent extends React.PureComponent<Props, State> {
  state = {
    hasError: false,
  }

  providerListener: IntervalID

  componentDidMount() {
    this.onConnect()
  }

  componentDidCatch(error: Error, info: Info) {
    const { openSnackbar } = this.props
    this.setState({ hasError: true })
    openSnackbar(WALLET_ERROR_MSG, 'error')

    logComponentStack(error, info)
  }

  onDisconnect = () => {
    const { removeProvider, openSnackbar } = this.props

    Web3Integration.disconnect()
  }

  onConnect = async (provider) => {
    console.log({provider})
    if (!provider) {
      return
    }
    const { openSnackbar } = this.props

    Web3Integration.setWeb3(provider)
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

const Header = connect(
  selector,
  actions,
)(HeaderComponent)

const HeaderSnack = () => (
  <SharedSnackbarConsumer>{({ openSnackbar }) => <Header openSnackbar={openSnackbar} />}</SharedSnackbarConsumer>
)

export default HeaderSnack
