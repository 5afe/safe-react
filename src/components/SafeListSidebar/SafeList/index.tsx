import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import styled from 'styled-components'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { setNetwork } from 'src/logic/config/utils'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { sortedSafeListSelector } from '../selectors'
import { getNetworkConfigById, getNetworkId, getNetworks } from 'src/config'
import { safeAddressFromUrl, SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import { getLocalNetworkSafes } from 'src/logic/safe/utils'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'

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

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const networks = getNetworks()
  const currentSafeAddress = useSelector(safeAddressFromUrl)
  const safes = useSelector(sortedSafeListSelector).filter((safe) => !safe.loadedViaUrl)
  const ownedSafes = useOwnerSafes()

  const [localSafes, setLocalSafes] = useState<Record<ETHEREUM_NETWORK, SafeRecordWithNames[]>>(
    Object.keys(networks).reduce(
      (acc, id) => ({ ...acc, [id]: [] }),
      {} as Record<ETHEREUM_NETWORK, SafeRecordWithNames[]>,
    ),
  )

  useEffect(() => {
    const getLocalSafes = () => {
      Object.entries(ETHEREUM_NETWORK).forEach(async ([name, id]) => {
        const localSafe = await getLocalNetworkSafes(name)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          [id]: localSafe,
        }))
      })
    }
    getLocalSafes()
  }, [])

  return (
    <>
      <StyledList>
        {networks.map(({ id, backgroundColor, textColor, label }) => {
          const isCurrentNetwork = id === getNetworkId()

          const addedSafeObjects: SafeRecordWithNames[] = isCurrentNetwork ? safes : localSafes[id]
          const ownedSafeObjects: (SafeRecordWithNames | Pick<SafeRecordWithNames, 'address'>)[] = isCurrentNetwork
            ? ownedSafes.map((address) => ({ address }))
            : localSafes?.[id] ?? []

          const nativeCoinSymbol = getNetworkConfigById(id)?.network?.nativeCoin?.symbol ?? 'ETH'
          const shouldExpandSafesNotAdded = ownedSafeObjects.some(({ address }) => isSafeAdded(safes, address))

          return (
            <Fragment key={id}>
              <ListItem selected>
                <StyledDot backgroundColor={backgroundColor} textColor={textColor} />
                {label}
              </ListItem>
              <MuiList>
                {addedSafeObjects?.map((safe) => (
                  <SafeListItem
                    key={safe.address}
                    onSafeClick={onSafeClick}
                    onNetworkSwitch={() => setNetwork(id)}
                    currentSafeAddress={currentSafeAddress}
                    nativeCoinSymbol={nativeCoinSymbol}
                    safes={safes}
                    {...safe}
                  />
                ))}
                {isCurrentNetwork && ownedSafeObjects?.length > 0 && (
                  <ListItem classes={{ root: classes.listItemCollapse }}>
                    <Collapse
                      title={`Safes owned on ${label} (${ownedSafeObjects.length})`}
                      defaultExpanded={shouldExpandSafesNotAdded}
                    >
                      {ownedSafeObjects?.map(({ address, ...rest }) => (
                        <SafeListItem
                          key={address}
                          address={address}
                          onSafeClick={onSafeClick}
                          currentSafeAddress={currentSafeAddress}
                          nativeCoinSymbol={nativeCoinSymbol}
                          safes={safes}
                          {...rest}
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
    </>
  )
}
