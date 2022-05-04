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
  safeAppChainId: string | null
}

const UserSafeSection = ({ safeAppUrl, availableChains, safeAppChainId }: UserSafeProps): ReactElement => {
  const userAddress = useSelector(userAccountSelector)
  const lastViewedSafeAddress = useSelector(lastViewedSafe)
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()
  const addressBook = useSelector(addressBookState)

  const compatibleUserSafes = getCompatibleSafes(ownedSafes, localSafes, availableChains, safeAppChainId, addressBook)

  const selectedUserSafe = getDefaultSafe(compatibleUserSafes, lastViewedSafeAddress, safeAppChainId)

  const isWalletConnected = !!userAddress

  return (
    <UserSafeContainer>
      <Title size="xs">Use the dApp with your Safe!</Title>
      {isWalletConnected ? (
        selectedUserSafe ? (
          <UseYourSafe safeAppUrl={safeAppUrl} defaultSafe={selectedUserSafe} safes={compatibleUserSafes} />
        ) : (
          <CreateNewSafe safeAppUrl={safeAppUrl} />
        )
      ) : (
        <ConnectWalletContainer>
          <ConnectWalletButton data-testid="connect-wallet-btn" />
        </ConnectWalletContainer>
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

const getCompatibleSafes = (
  ownedSafes: Record<string, string[]>,
  localSafes: LocalSafes,
  availableChains: string[],
  safeAppChainId: string | null,
  addressBook: AddressBookEntry[],
): AddressBookEntry[] => {
  // we include the chainId provided in the query params in the available chains list
  const compatibleChains =
    safeAppChainId && !availableChains.includes(safeAppChainId) ? [...availableChains, safeAppChainId] : availableChains

  // we collect all compatible safes from the Config Service & Local Storage
  const compatibleSafes = compatibleChains.reduce((compatibleSafes, chainId) => {
    // Safes from Config Service
    const safesFromConfigService =
      ownedSafes[chainId]?.map((address) => ({
        address,
        chainId,
        name: getNameFromAddressBook(addressBook, address, chainId),
      })) || []

    // Safes from Local Storage
    const safesFromLocalstorage =
      localSafes[chainId]
        ?.filter(({ address }) => !ownedSafes[chainId]?.includes(address)) // we filter Safes already included
        ?.map(({ address }) => ({
          address,
          chainId,
          name: getNameFromAddressBook(addressBook, address, chainId),
        })) || []

    return [...compatibleSafes, ...safesFromConfigService, ...safesFromLocalstorage]
  }, [])

  return compatibleSafes
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
