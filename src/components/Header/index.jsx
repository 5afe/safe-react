// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { logComponentStack, type Info } from '~/utils/logBoundaries'
import { WALLET_ERROR_MSG } from '~/logic/wallets/store/actions'
import { SharedSnackbarConsumer, type Variant } from '~/components/SharedSnackBar'
import Web3Integration from '~/logic/wallets/web3Integration'
import ProviderAccesible from './component/ProviderInfo/ProviderAccesible'
import UserDetails from './component/ProviderDetails/UserDetails'
import ProviderDisconnected from './component/ProviderInfo/ProviderDisconnected'
import ConnectDetails from './component/ProviderDetails/ConnectDetails'
import Layout from './component/Layout'
import selector, { type SelectorProps } from './selector'

type Props = SelectorProps & {
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
    Web3Integration.disconnect()
  }

  onConnect = async (provider) => {
    if (!provider) {
      return
    }

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
  null,
)(HeaderComponent)

const HeaderSnack = () => (
  <SharedSnackbarConsumer>{({ openSnackbar }) => <Header openSnackbar={openSnackbar} />}</SharedSnackbarConsumer>
)

export default HeaderSnack
