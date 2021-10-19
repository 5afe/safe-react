import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import { UserDetails } from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import {
  availableSelector,
  loadedSelector,
  networkSelector,
  providerNameSelector,
  userAccountSelector,
} from 'src/logic/wallets/store/selectors'
import { removeProvider } from 'src/logic/wallets/store/actions'
import { canSwitchNetwork, switchNetwork } from 'src/logic/wallets/utils/network'
import { getNetworkId } from 'src/config'
import { onboard } from 'src/components/ConnectButton'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'

const HeaderComponent = (): React.ReactElement => {
  const provider = useSelector(providerNameSelector)
  const userAddress = useSelector(userAccountSelector)
  const network = useSelector(networkSelector)
  const loaded = useSelector(loadedSelector)
  const available = useSelector(availableSelector)
  const dispatch = useDispatch()
  const showSwitchButton = canSwitchNetwork()

  useEffect(() => {
    const tryToConnectToLastUsedProvider = async () => {
      const lastUsedProvider = await loadLastUsedProvider()
      if (lastUsedProvider) {
        await onboard.walletSelect(lastUsedProvider)
      }
    }

    tryToConnectToLastUsedProvider()
  }, [])

  const openDashboard = () => {
    const { wallet } = onboard.getState()
    return wallet.type === 'sdk' && wallet.dashboard
  }

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  const onNetworkChange = async () => {
    const { wallet } = onboard.getState()
    const desiredNetwork = getNetworkId()
    try {
      await switchNetwork(wallet, desiredNetwork)
    } catch (e) {
      e.log()
      // Fallback to the onboard popup if switching isn't supported
      await onboard.walletCheck()
    }
  }

  const getProviderInfoBased = () => {
    if (!loaded || !provider) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible connected={available} provider={provider} userAddress={userAddress} />
  }

  const getProviderDetailsBased = () => {
    if (!loaded) {
      return <ConnectDetails />
    }

    return (
      <UserDetails
        connected={available}
        network={network}
        onDisconnect={onDisconnect}
        onNetworkChange={showSwitchButton ? onNetworkChange : undefined}
        openDashboard={openDashboard()}
        provider={provider}
        userAddress={userAddress}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return <Layout providerDetails={details} providerInfo={info} />
}

export default HeaderComponent
