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

const isNotLoadedViaUrl = ({ loadedViaUrl }: SafeRecordWithNames) => !loadedViaUrl

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const loadedSafes = useSelector(sortedSafeListSelector).filter(isNotLoadedViaUrl)
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()

  return (
    <>
      <StyledList>
        {networks.map(({ id, backgroundColor, textColor, label }) => {
          const isCurrentNetwork = id === getNetworkId()

          const localSafesOnNetwork = localSafes[id].filter(isNotLoadedViaUrl)
          const addedSafesOnNetwork = isCurrentNetwork ? loadedSafes : localSafesOnNetwork
          const shouldExpandOwnedSafes = localSafesOnNetwork.some(({ address }) => isSafeAdded(loadedSafes, address))

          if (!localSafesOnNetwork.length && !addedSafesOnNetwork.length) return null
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
                    onNetworkSwitch={() => setNetwork(id)}
                    onSafeClick={onSafeClick}
                    safes={loadedSafes}
                    {...safe}
                  />
                ))}
                {ownedSafes.length > 0 && (
                  <ListItem classes={{ root: classes.listItemCollapse }}>
                    <Collapse
                      title={`Safes owned on ${label} (${localSafesOnNetwork.length})`}
                      defaultExpanded={shouldExpandOwnedSafes}
                    >
                      {ownedSafes.map((address) => (
                        <SafeListItem key={address} address={address} onSafeClick={onSafeClick} safes={loadedSafes} />
                      ))}
                    </Collapse>
                  </ListItem>
                )}
              </MuiList>
            </Fragment>
          )
        })}
      </StyledList>
    </>
  )
}
