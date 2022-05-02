import { ReactElement, useState } from 'react'
import { useSelector } from 'react-redux'
import { Title, Button, Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import SuccessSvg from 'src/assets/icons/safe-created.svg'
import { generateSafeRoute, OPEN_SAFE_ROUTE, SAFE_ROUTES } from 'src/routes/routes'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import SafeAddressSelector from 'src/components/SafeAddressSelector/SafeAddressSelector'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import useLocalSafes, { LocalSafes } from 'src/logic/safe/hooks/useLocalSafes'
import { lastViewedSafe } from 'src/logic/currentSession/store/selectors'
import { addressBookState } from 'src/logic/addressBook/store/selectors'
import { getChainById } from 'src/config'

type UserSafeProps = {
  safeAppUrl: string
  availableChains: string[]
  safeAppChainId: string | null
}

const UserSafe = ({ safeAppUrl, availableChains, safeAppChainId }: UserSafeProps): ReactElement => {
  const userAddress = useSelector(userAccountSelector)
  const lastViewedSafeAddress = useSelector(lastViewedSafe)
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()
  const addressBook = useSelector(addressBookState)

  const compatibleUserSafes = getCompatibleSafes(ownedSafes, localSafes, availableChains, safeAppChainId, addressBook)

  const selectedUserSafe =
    compatibleUserSafes.find((safe) => safe.address === lastViewedSafeAddress) || compatibleUserSafes[0]

  const isWalletConnected = !!userAddress

  return (
    <UserSafeContainer>
      <Title size="xs">Use the dApp with your Safe!</Title>
      {isWalletConnected ? (
        selectedUserSafe ? (
          <SelectedUserSafe safeAppUrl={safeAppUrl} defaultSafe={selectedUserSafe} safes={compatibleUserSafes} />
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

export default UserSafe

type CompatibleSafe = {
  address: string
  chainId: string
  name: string
}

const getCompatibleSafes = (
  ownedSafes: Record<string, string[]>,
  localSafes: LocalSafes,
  availableChains: string[],
  safeAppChainId: string | null,
  addressBook: AddressBookEntry[],
): CompatibleSafe[] => {
  // we include the chainId provided in the query params in the available chains list
  const compatibleChains =
    safeAppChainId && !availableChains.includes(safeAppChainId) ? [...availableChains, safeAppChainId] : availableChains

  // we collect all compatible safes from the Config Service & Local Storage
  const compatibleSafes = compatibleChains.reduce((compatibleSafes, chainId) => {
    const safesFromConfigService =
      ownedSafes[chainId]?.map((address) => ({
        address,
        chainId,
        name: getNameFromAddressBook(addressBook, address, chainId),
      })) || []

    const safesFromLocalstorage =
      localSafes[chainId]
        .filter(({ address }) => !ownedSafes[chainId]?.includes(address)) // we filter the already added safes provided by the config service
        .map(({ address }) => ({
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

const UserSafeContainer = styled.div`
  flex: 1 0 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledCreateButton = styled(Button)`
  margin-top: 30px;
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

type CreateNewSafeProps = {
  safeAppUrl: string
}

const CreateNewSafe = ({ safeAppUrl }: CreateNewSafeProps): ReactElement => {
  const createSafeLink = `${OPEN_SAFE_ROUTE}?redirect=${encodeURIComponent(`${SAFE_ROUTES.APPS}?appUrl=${safeAppUrl}`)}`

  return (
    <>
      <img alt="Vault" height={92} src={SuccessSvg} />

      <StyledCreateButton size="lg" color="primary" variant="contained" component={Link} to={createSafeLink}>
        <Text size="xl" color="white">
          Create new Safe
        </Text>
      </StyledCreateButton>
    </>
  )
}

type SelectedUserSafeTypes = {
  defaultSafe: AddressBookEntry
  safeAppUrl: string
  safes: AddressBookEntry[]
}

const SelectedUserSafe = ({ safeAppUrl, defaultSafe, safes }: SelectedUserSafeTypes): ReactElement => {
  const [selectedSafe, setSelectedSafe] = useState<AddressBookEntry>(defaultSafe)

  const appsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
    shortName: getChainById(selectedSafe.chainId).shortName,
    safeAddress: selectedSafe.address,
  })
  const openSafeAppLink = `${appsPath}?appUrl=${encodeURI(safeAppUrl)}`

  return (
    <>
      <SelectorContainer>
        <SafeAddressSelector
          value={selectedSafe.address}
          safes={safes}
          onChange={(event) => {
            const newSelectedSafe = safes.find(({ address }) => address === event.target.value)
            if (newSelectedSafe) {
              setSelectedSafe(newSelectedSafe)
            }
          }}
        />
      </SelectorContainer>

      <StyledCreateButton size="lg" color="primary" variant="contained" component={Link} to={openSafeAppLink}>
        <Text size="xl" color="white">
          Connect Safe
        </Text>
      </StyledCreateButton>
    </>
  )
}

const SelectorContainer = styled.div`
  flex-grow: 1;
  justify-content: center;
  margin-top: 24px;
`
