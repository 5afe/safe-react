import { useEffect, useState, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { Text, Button } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import SafeAddressSelector from 'src/components/SafeAddressSelector/SafeAddressSelector'
import { getChainById } from 'src/config'
import { AddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'

type UseYourSafeTypes = {
  safeAppUrl: string
  defaultSafe: AddressBookEntry
  safes: AddressBookEntry[]
}

const UseYourSafe = ({ safes, safeAppUrl, defaultSafe }: UseYourSafeTypes): ReactElement => {
  const [selectedSafe, setSelectedSafe] = useState<AddressBookEntry>(defaultSafe)

  useEffect(() => {
    setSelectedSafe(defaultSafe)
  }, [defaultSafe])
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

export default UseYourSafe

const StyledCreateButton = styled(Button)`
  margin-top: 30px;
`

const SelectorContainer = styled.div`
  flex-grow: 1;
  justify-content: center;
  margin-top: 24px;
  max-width: 320px;
  width: 100%;
`
