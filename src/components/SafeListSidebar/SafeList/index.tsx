import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import React from 'react'
import styled from 'styled-components'
import { getNetworkId, getNetworkName, getNetworks } from 'src/config'
import { safeAddressFromUrl, SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import SafeListItem from './SafeListItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { setNetwork } from 'src/logic/config/utils'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { getSafesKey } from 'src/logic/addressBook/utils/v2-migration'
import { useSelector } from 'react-redux'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { sortedSafeListSelector } from '../selectors'

const StyledDot = styled.span<{ backgroundColor: string; textColor: string }>`
  width: 15px;
  height: 15px;
  color: ${({ textColor }) => textColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
`

const StyledList = styled(MuiList)`
  height: '100%';
  overflow-x: 'hidden';
  overflow-y: 'auto';
  padding: 0;
`

const useStyles = makeStyles({
  listItemCollapse: {
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: '50px',
    '& > div > div:first-child': {
      paddingLeft: '44px',
    },
  },
})

type Props = {
  onSafeClick: () => void
}

const isAddressAdded = (addedSafes: SafeRecordWithNames[], address: string): boolean =>
  addedSafes.some((safe) => sameAddress(safe.address, address))

const getSafesStoredLocally = (
  networkId: ETHEREUM_NETWORK,
  safes: SafeRecordWithNames[],
  ownedSafes: string[],
): SafeRecordWithNames[] => {
  let otherSafes: SafeRecordWithNames[] = []

  const name = getNetworkName(networkId)
  const safeString = localStorage.getItem(getSafesKey(name))

  if (safeString) {
    try {
      Object.values(JSON.parse(safeString)).forEach((parsedSafe: any) => {
        const isAddedSafe = isAddressAdded(safes, parsedSafe.address)
        const isOwnedSafe = ownedSafes.includes(parsedSafe.address)
        if (isAddedSafe || isOwnedSafe) return

        otherSafes = [...otherSafes, parsedSafe]
      })
    } catch {}
  }

  return otherSafes
}

export const SafeList = ({ onSafeClick }: Props): React.ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const currentSafeAddress = useSelector(safeAddressFromUrl)
  const safes = useSelector(sortedSafeListSelector).filter((safe) => !safe.loadedViaUrl)
  const ownedSafes = useOwnerSafes()
  const safesNotAdded = ownedSafes.filter((address) => !isAddressAdded(safes, address))
  const hasSafesNotAdded = safesNotAdded.length > 0
  const shouldExpandSafesNotAdded = safesNotAdded.some((address) => address === currentSafeAddress)

  return (
    <>
      <StyledList>
        {networks.map(({ id, backgroundColor, textColor, label }) => {
          const isCurrentNetwork = id === getNetworkId()
          const addedSafes = isCurrentNetwork ? safes : getSafesStoredLocally(id, safes, ownedSafes)

          if (!isCurrentNetwork && (addedSafes.length === 0 || !hasSafesNotAdded)) return null
          return (
            <React.Fragment key={id}>
              <ListItem selected>
                <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
                {label}
              </ListItem>
              <MuiList>
                {addedSafes?.map((safe) => (
                  <SafeListItem
                    key={safe.address}
                    onSafeClick={onSafeClick}
                    onNetworkSwitch={() => setNetwork(id)}
                    currentSafeAddress={currentSafeAddress}
                    {...safe}
                  />
                ))}
                {isCurrentNetwork && hasSafesNotAdded && (
                  <ListItem classes={{ root: classes.listItemCollapse }}>
                    <Collapse
                      title={`Other Safes owned on ${label} (${safesNotAdded.length})`}
                      defaultExpanded={shouldExpandSafesNotAdded}
                    >
                      {safesNotAdded?.map((address) => (
                        <SafeListItem
                          key={address}
                          address={address}
                          onSafeClick={onSafeClick}
                          currentSafeAddress={currentSafeAddress}
                        />
                      ))}
                    </Collapse>
                  </ListItem>
                )}
              </MuiList>
            </React.Fragment>
          )
        })}
      </StyledList>
    </>
  )
}
