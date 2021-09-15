import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import React from 'react'
import styled from 'styled-components'
import { getConfig, getNetworkId, getNetworkLabel, getNetworkName, getNetworks, setNetworkId } from 'src/config'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import SafeListItem from './SafeListItem'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { makeNetworkConfig } from 'src/logic/config/model/networkConfig'
import { configStore } from 'src/logic/config/store/actions'
import { APP_ENV } from 'src/utils/constants'
import { useDispatch } from 'react-redux'

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
  currentSafeAddress: string | undefined
  safes: SafeRecordWithNames[]
  ownedSafes: string[]
  onSafeClick: () => void
}

const isAddressAdded = (addedSafes: SafeRecordWithNames[], address: string): boolean =>
  addedSafes.some((safe) => sameAddress(safe.address, address))

export const SafeList = ({ currentSafeAddress, onSafeClick, safes, ownedSafes }: Props): React.ReactElement => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const networks = getNetworks()

  const safesNotAdded = ownedSafes.filter((address) => !isAddressAdded(safes, address))
  const noSafesAdded = safes.length === ownedSafes.length
  const safesNotAddedExpanded = safesNotAdded.some((address) => address === currentSafeAddress)

  const onNetworkSwitch = (safeUrl: string, networkId: ETHEREUM_NETWORK) => {
    if (networkId === getNetworkId()) return
    // FIXME: remove navigation when L2-UX completes
    // This was added in order to switch network using navigation on prod
    // but be able to check chain swapping on dev environments and PRs
    if (APP_ENV === 'production') {
      window.location.href = safeUrl
    } else {
      setNetworkId(getNetworkName(networkId))
      const safeConfig = makeNetworkConfig(getConfig())
      dispatch(configStore(safeConfig))
    }
  }

  return (
    <>
      <StyledList>
        {networks.map(({ id, label, backgroundColor, textColor, safeUrl }) => {
          const hasNetworkSafes = label === getNetworkLabel()
          if (!hasNetworkSafes) return null
          return (
            <React.Fragment key={id}>
              <ListItem selected>
                <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
                {label}
              </ListItem>
              <MuiList>
                {safes?.map((safe) => (
                  <SafeListItem
                    key={safe.address}
                    onSafeClick={onSafeClick}
                    onNetworkSwitch={() => onNetworkSwitch(safeUrl, id)}
                    currentSafeAddress={currentSafeAddress}
                    {...safe}
                  />
                ))}
                {safesNotAdded.length > 0 && (
                  <ListItem classes={{ root: classes.listItemCollapse }}>
                    <Collapse
                      title={`${noSafesAdded ? '' : 'Other '}Safes owned on ${label} (${safesNotAdded.length})`}
                      defaultExpanded={safesNotAddedExpanded}
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
