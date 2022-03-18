import { lazy, useEffect } from 'react'
import { useSelector } from 'react-redux'

import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import { UserDetails } from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import { currentChainId } from 'src/logic/config/store/selectors'
import {
  availableSelector,
  loadedSelector,
  providerNameSelector,
  userAccountSelector,
  userEnsSelector,
} from 'src/logic/wallets/store/selectors'
import onboard, { loadLastUsedProvider } from 'src/logic/wallets/onboard'
import { isSupportedWallet } from 'src/logic/wallets/utils/walletList'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'

const HidePairingModule = lazy(
  () => import('src/components/AppLayout/Header/components/ProviderDetails/HidePairingModule'),
)

const HeaderComponent = (): React.ReactElement => {
  const provider = useSelector(providerNameSelector)
  const chainId = useSelector(currentChainId)
  const userAddress = useSelector(userAccountSelector)
  const ensName = useSelector(userEnsSelector)
  const loaded = useSelector(loadedSelector)
  const available = useSelector(availableSelector)

  useEffect(() => {
    const tryToConnectToLastUsedProvider = async () => {
      const lastUsedProvider = loadLastUsedProvider()
      const isProviderEnabled = lastUsedProvider && isSupportedWallet(lastUsedProvider)
      if (isProviderEnabled) {
        await onboard().walletSelect(lastUsedProvider)
      }
    }

    tryToConnectToLastUsedProvider()
  }, [chainId])

  const openDashboard = () => {
    const { wallet } = onboard().getState()
    return wallet.type === 'sdk' && wallet.dashboard
  }

  const onDisconnect = () => {
    onboard().walletReset()
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
        onDisconnect={onDisconnect}
        openDashboard={openDashboard()}
        provider={provider}
        userAddress={userAddress}
        ensName={ensName}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return (
    <>
      {isPairingSupported() && wrapInSuspense(<HidePairingModule />)}
      <Layout providerDetails={details} providerInfo={info} />
    </>
  )
}

export default HeaderComponent
