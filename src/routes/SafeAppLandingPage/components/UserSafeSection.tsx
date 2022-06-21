import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Title } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import uniq from 'lodash/uniq'

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

const getCompatibleSafes = (
  safesFromLocalStorage: LocalSafes,
  safesFromService: Record<string, string[]>,
  compatibleChains: string[],
  addressBook: AddressBookEntry[],
): AddressBookEntry[] => {
  return compatibleChains.reduce((result, chainId) => {
    const flatSafesFromLocalStorage = safesFromLocalStorage[chainId]?.map(({ address }) => address) || []
    const flatSafesFromService = safesFromService[chainId] || []

    // we remove duplicated safes
    const allSafes = uniq([...flatSafesFromService, ...flatSafesFromLocalStorage])

    const compatibleSafes = allSafes.map((address) => ({
      address,
      chainId,
      name: getNameFromAddressBook(addressBook, address, chainId),
    }))

    return [...result, ...compatibleSafes]
  }, [])
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

  // we collect all compatible safes from backend and localstorage
  const compatibleSafes = getCompatibleSafes(safesFromLocalStorage, safesFromService, compatibleChains, addressBook)

  const selectedUserSafe = getDefaultSafe(compatibleSafes, lastViewedSafeAddress, safeAppChainId)

  const isWalletConnected = !!userAddress
  const hasComplatibleSafes = compatibleSafes.length > 0

  const showConnectWalletSection = !isWalletConnected && !hasComplatibleSafes

  return (
    <UserSafeContainer>
      <Title size="xs">Use the dApp with your Safe!</Title>
      {showConnectWalletSection ? (
        <ConnectWalletContainer>
          <ConnectWalletButton data-testid="connect-wallet-btn" />
        </ConnectWalletContainer>
      ) : selectedUserSafe ? (
        <UseYourSafe safeAppUrl={safeAppUrl} defaultSafe={selectedUserSafe} safes={compatibleSafes} />
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
