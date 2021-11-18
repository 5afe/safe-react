import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import styled from 'styled-components'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Fragment, ReactElement } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import uniqBy from 'lodash/uniqBy'

import { setNetwork } from 'src/logic/config/utils'
import { getNetworkId, getNetworks } from 'src/config'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { extractSafeAddress, WELCOME_ROUTE } from 'src/routes/routes'

const MAX_EXPANDED_SAFES = 3

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

  & p > a {
    color: inherit;
  }
`

const useStyles = makeStyles({
  listItemCollapse: {
    '&:not(:first-child)': {
      paddingTop: '10px',
    },

    padding: '0 0 0 0',
    '& > div > div:first-child': {
      paddingLeft: '44px',
      paddingTop: '8px',
      paddingBottom: '8px',
    },
  },
})

const PlaceholderText = styled(Text)`
  padding: 16px 44px;
`

type Props = {
  onSafeClick: () => void
}

const isNotLoadedViaUrl = ({ loadedViaUrl }: SafeRecordWithNames) => loadedViaUrl === false

const isSameAddress = (addrA: string, addrB: string): boolean => addrA.toLowerCase() === addrB.toLowerCase()

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const currentSafeAddress = extractSafeAddress()
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()

  return (
    <StyledList>
      {networks.map(({ id, backgroundColor, textColor, label }) => {
        const isCurrentNetwork = id === getNetworkId()
        const ownedSafesOnNetwork = ownedSafes[id] || []
        const localSafesOnNetwork = uniqBy(localSafes[id].filter(isNotLoadedViaUrl), ({ address }) =>
          address.toLowerCase(),
        )

        if (!isCurrentNetwork && !ownedSafesOnNetwork.length && !localSafesOnNetwork.length) {
          return null
        }

        let shouldExpandOwnedSafes = false
        if (ownedSafesOnNetwork.includes(currentSafeAddress)) {
          // Expand the Owned Safes if the current Safe is owned, but not added
          shouldExpandOwnedSafes = !localSafesOnNetwork.some(({ address }) =>
            isSameAddress(address, currentSafeAddress),
          )
        } else {
          // Expand the Owned Safes if there are no added Safes
          shouldExpandOwnedSafes = !localSafesOnNetwork.length && ownedSafesOnNetwork.length <= MAX_EXPANDED_SAFES
        }

        return (
          <Fragment key={id}>
            <ListItem selected>
              <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
              {label}
            </ListItem>
            <MuiList>
              {localSafesOnNetwork.map((safe) => (
                <SafeListItem
                  key={safe.address}
                  networkId={id}
                  onNetworkSwitch={() => setNetwork(id)}
                  onSafeClick={onSafeClick}
                  shouldScrollToSafe
                  {...safe}
                />
              ))}

              {!localSafesOnNetwork.length && !ownedSafesOnNetwork.length && (
                <PlaceholderText size="lg" color="placeHolder">
                  <Link to={WELCOME_ROUTE} onClick={onSafeClick}>
                    Create or add
                  </Link>{' '}
                  an existing Safe on this network
                </PlaceholderText>
              )}

              {ownedSafesOnNetwork.length > 0 && (
                <ListItem classes={{ root: classes.listItemCollapse }} component="div">
                  <Collapse
                    title={
                      <Text
                        size="lg"
                        color="placeHolder"
                      >{`Safes owned on ${label} (${ownedSafesOnNetwork.length})`}</Text>
                    }
                    key={String(shouldExpandOwnedSafes)}
                    defaultExpanded={shouldExpandOwnedSafes}
                  >
                    {ownedSafesOnNetwork.map((ownedAddress) => {
                      const isAdded = localSafesOnNetwork.some(({ address }) => isSameAddress(address, ownedAddress))

                      return (
                        <SafeListItem
                          key={ownedAddress}
                          address={ownedAddress}
                          networkId={id}
                          onSafeClick={onSafeClick}
                          showAddSafeLink={!isAdded}
                          shouldScrollToSafe={!isAdded}
                        />
                      )
                    })}
                  </Collapse>
                </ListItem>
              )}
            </MuiList>
          </Fragment>
        )
      })}
    </StyledList>
  )
}
