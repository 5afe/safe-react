import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Title } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import useLocalSafes, { LocalSafes } from 'src/logic/safe/hooks/useLocalSafes'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import { addressBookState } from 'src/logic/addressBook/store/selectors'
import CreateNewSafe from './CreateNewSafe'
import UseYourSafe from './UseYourSafe'

type UserSafeProps = {
  safeAppUrl: string
  availableChains: string[]
  safeAppChainId: string
}

const UserSafeSection = ({ safeAppUrl, availableChains, safeAppChainId }: UserSafeProps): ReactElement => {
  const userAddress = useSelector(userAccountSelector)
  const lastViewedSafeAddress = useSelector(lastViewedSafe)
  const safesFromService = useOwnerSafes()
  const safesFromLocalStorage = useLocalSafes()
  const addressBook = useSelector(addressBookState)

  // we include the chainId provided in the query params in the available chains list
  const compatibleChains = !availableChains.includes(safeAppChainId)
    ? [...availableChains, safeAppChainId]
    : availableChains

  // we collect all compatible safes from backend
  const compatibleUserSafesFromService = getCompatibleSafesFromService(safesFromService, compatibleChains, addressBook)

  // we collect all compatible safes from the localstorage
  const compatibleUserSafesFromLocalStorage = getCompatibleSafesFromLocalStorage(
    safesFromService,
    safesFromLocalStorage,
    compatibleChains,
    addressBook,
  )

  const compatibleUserSafes = [...compatibleUserSafesFromLocalStorage, ...compatibleUserSafesFromService]

  const selectedUserSafe = getDefaultSafe(compatibleUserSafes, lastViewedSafeAddress, safeAppChainId)

  const isWalletConnected = !!userAddress
  const hasComplatibleSafesInLocalStotorage = compatibleUserSafesFromLocalStorage.length > 0

  const showConnectWalletSection = !isWalletConnected && !hasComplatibleSafesInLocalStotorage

  return (
    <UserSafeContainer>
      <Title size="xs">Use the dApp with your Safe!</Title>
      {showConnectWalletSection ? (
        <ConnectWalletContainer>
          <ConnectWalletButton data-testid="connect-wallet-btn" />
        </ConnectWalletContainer>
      ) : selectedUserSafe ? (
        <UseYourSafe safeAppUrl={safeAppUrl} defaultSafe={selectedUserSafe} safes={compatibleUserSafes} />
      ) : (
        <CreateNewSafe safeAppUrl={safeAppUrl} />
      )}
    </UserSafeContainer>
  )
}

export default UserSafeSection

const UserSafeContainer = styled.div`
  flex: 1 0 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const ConnectWalletContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const ConnectWalletButton = styled(ConnectButton)`
  height: 52px;
`

const getCompatibleSafesFromLocalStorage = (
  safesFromService: Record<string, string[]>,
  safesFromLocalStorage: LocalSafes,
  compatibleChains: string[],
  addressBook: AddressBookEntry[],
): AddressBookEntry[] => {
  return compatibleChains.reduce((compatibleSafes, chainId) => {
    const safesFromLocalstorage =
      safesFromLocalStorage[chainId]
        ?.filter(({ address }) => !safesFromService[chainId]?.includes(address)) // we filter Safes already included
        ?.map(({ address }) => ({
          address,
          chainId,
          name: getNameFromAddressBook(addressBook, address, chainId),
        })) || []

    return [...compatibleSafes, ...safesFromLocalstorage]
  }, [])
}

const getCompatibleSafesFromService = (
  safesFromService: Record<string, string[]>,
  compatibleChains: string[],
  addressBook: AddressBookEntry[],
): AddressBookEntry[] => {
  return compatibleChains.reduce((compatibleSafes, chainId) => {
    const safesFromConfigService =
      safesFromService[chainId]?.map((address) => ({
        address,
        chainId,
        name: getNameFromAddressBook(addressBook, address, chainId),
      })) || []

    return [...compatibleSafes, ...safesFromConfigService]
  }, [])
}

const getNameFromAddressBook = (addressBook: AddressBookEntry[], address: string, chainId: string) => {
  const addressBookEntry = addressBook.find(
    (addressBookEntry) => addressBookEntry.address === address && addressBookEntry.chainId === chainId,
  )

  return addressBookEntry?.name || ''
}

const getDefaultSafe = (
  compatibleUserSafes: AddressBookEntry[],
  lastViewedSafeAddress: string | null,
  safeAppChainId: string | null,
) => {
  // as a first option, we use the last viewed user Safe in the provided chain
  const lastViewedSafe = compatibleUserSafes.find(
    (safe) => safe.address === lastViewedSafeAddress && safe.chainId === safeAppChainId,
  )

  if (lastViewedSafe) {
    return lastViewedSafe
  }

  // as a second option, we use any user Safe in the provided chain
  const safeInTheSameChain = compatibleUserSafes.find((safe) => safe.chainId === safeAppChainId)

  if (safeInTheSameChain) {
    return safeInTheSameChain
  }

  // as a fallback we salect a random compatible user Safe
  return compatibleUserSafes[0]
}
