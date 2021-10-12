import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import styled from 'styled-components'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Fragment, ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { setNetwork } from 'src/logic/config/utils'
import { sortedSafeListSelector } from '../selectors'
import { getNetworkId, getNetworks } from 'src/config'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { extractSafeAddress } from 'src/routes/routes'

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
    '&:not(:first-child)': {
      paddingTop: '10px',
    },

    padding: '0 0 0 0',
    '& > div > div:first-child': {
      paddingLeft: '44px',
      paddingTop: '0',
    },
  },
})

type Props = {
  onSafeClick: () => void
}

const isNotLoadedViaUrl = ({ loadedViaUrl }: SafeRecordWithNames) => !loadedViaUrl

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const currentSafeAddress = extractSafeAddress()
  const loadedSafes = useSelector(sortedSafeListSelector).filter(isNotLoadedViaUrl)
  const connectedWalletAddress = useSelector(userAccountSelector)
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()

  return (
    <StyledList>
      {networks.map(({ id, backgroundColor, textColor, label }) => {
        const isConnected = !!connectedWalletAddress
        const isCurrentNetwork = id === getNetworkId()
        const isConnectedToCurrentNetwork = isCurrentNetwork && isConnected

        const localSafesOnNetwork = localSafes[id].filter(isNotLoadedViaUrl)
        const addedSafesOnNetwork = isConnectedToCurrentNetwork ? loadedSafes : localSafesOnNetwork

        const shouldExpandOwnedSafes = isConnectedToCurrentNetwork
          ? ownedSafes.some((address) => address === currentSafeAddress && !isSafeAdded(loadedSafes, address))
          : localSafesOnNetwork.some(
              ({ address }) => address === currentSafeAddress && isSafeAdded(loadedSafes, address),
            )

        const hasSafes = isConnectedToCurrentNetwork ? ownedSafes.length > 0 : localSafesOnNetwork.length > 0
        if (!hasSafes) return null
        return (
          <Fragment key={id}>
            <ListItem selected>
              <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
              {label}
            </ListItem>
            <MuiList>
              {addedSafesOnNetwork.map((safe) => (
                <SafeListItem
                  key={safe.address}
                  networkId={id}
                  onNetworkSwitch={() => setNetwork(id)}
                  onSafeClick={onSafeClick}
                  loadedSafes={loadedSafes}
                  shouldScrollToSafe
                  {...safe}
                />
              ))}
              {isCurrentNetwork && ownedSafes.length > 0 && (
                <ListItem classes={{ root: classes.listItemCollapse }} component="div">
                  <Collapse
                    title={`Safes owned on ${label} (${ownedSafes.length})`}
                    defaultExpanded={shouldExpandOwnedSafes}
                  >
                    {ownedSafes.map((address) => (
                      <SafeListItem
                        key={address}
                        address={address}
                        networkId={id}
                        onSafeClick={onSafeClick}
                        loadedSafes={loadedSafes}
                        shouldScrollToSafe={!isSafeAdded(loadedSafes, address)}
                      />
                    ))}
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
