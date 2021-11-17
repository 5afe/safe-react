import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import styled from 'styled-components'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Fragment, ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'

import { setNetwork } from 'src/logic/config/utils'
import { sortedSafeListSelector } from '../selectors'
import { getNetworkId, getNetworks } from 'src/config'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { extractSafeAddress, WELCOME_ROUTE } from 'src/routes/routes'
import { checksumAddress } from 'src/utils/checksumAddress'

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

const isNotLoadedViaUrl = ({ loadedViaUrl }: SafeRecordWithNames) => !loadedViaUrl

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const currentSafeAddress = extractSafeAddress()

  const addedSafes = useSelector(sortedSafeListSelector)
    .filter(isNotLoadedViaUrl)
    .map((loadedSafe) => ({ ...loadedSafe, address: checksumAddress(loadedSafe.address) }))
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()

  return (
    <StyledList>
      {networks.map(({ id, backgroundColor, textColor, label }) => {
        const isCurrentNetwork = id === getNetworkId()

        const addedSafesOnNetwork = addedSafes.filter((addedSafe) => addedSafe.chainId === id)
        const ownedSafesOnNetwork = ownedSafes[id] || []
        const localSafesOnNetwork = localSafes[id].filter(isNotLoadedViaUrl).map((localSafe) => ({
          ...localSafe,
          address: checksumAddress(localSafe.address),
        }))

        const safes = isCurrentNetwork ? addedSafesOnNetwork : localSafesOnNetwork

        const shouldExpandOwnedSafes = isCurrentNetwork
          ? ownedSafesOnNetwork.some((address) => address === currentSafeAddress && !isSafeAdded(addedSafes, address))
          : safes.length !== addedSafesOnNetwork.length && ownedSafesOnNetwork.length <= MAX_EXPANDED_SAFES

        if (
          !isCurrentNetwork &&
          !addedSafesOnNetwork.length &&
          !ownedSafesOnNetwork.length &&
          !localSafesOnNetwork.length
        ) {
          return null
        }

        return (
          <Fragment key={id}>
            <ListItem selected>
              <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
              {label}
            </ListItem>
            <MuiList>
              {safes.length > 0 &&
                safes.map((safe) => (
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
                    defaultExpanded={shouldExpandOwnedSafes}
                  >
                    {ownedSafesOnNetwork.map((address) => {
                      const isAdded = isSafeAdded(safes, address)
                      return (
                        <SafeListItem
                          key={address}
                          address={address}
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
