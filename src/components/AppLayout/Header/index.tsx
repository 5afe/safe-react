import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import { UserDetails } from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import { currentChainId } from 'src/logic/config/store/selectors'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import { loadLastUsedWallet } from 'src/logic/wallets/onboard/utils'
import { isSupportedWallet } from 'src/logic/wallets/onboard/wallets'

const HeaderComponent = (): React.ReactElement => {
  const { wallet, account, loaded, available, connect, disconnect } = useOnboard()
  const provider = wallet.label
  const userAddress = account.address
  const chainId = useSelector(currentChainId)

  useEffect(() => {
    const tryLastUsedWallet = async () => {
      const lastUsedWallet = loadLastUsedWallet()
      const isWalletEnabled = lastUsedWallet && isSupportedWallet(lastUsedWallet)
      if (isWalletEnabled) {
        await connect({ label: lastUsedWallet, disableModals: true })
      }
    }

    tryLastUsedWallet()
  }, [chainId, connect])

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
        onDisconnect={disconnect}
        provider={provider}
        userAddress={userAddress}
        ensName={account.ens?.name || ''}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return <Layout providerDetails={details} providerInfo={info} />
}

export default HeaderComponent
