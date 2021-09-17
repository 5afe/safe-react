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
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import { getLocalNetworkSafesById } from 'src/logic/safe/utils'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'

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
  const safes = useSelector(sortedSafeListSelector).filter((safe) => !safe.loadedViaUrl)
  const ownedSafes = useOwnerSafes()

  const [localSafes, setLocalSafes] = useState<Record<ETHEREUM_NETWORK, SafeRecordProps[] | never[]>>(
    Object.values(ETHEREUM_NETWORK).reduce(
      (safes, networkId) => ({ ...safes, [networkId]: [] }),
      {} as Record<ETHEREUM_NETWORK, never[]>,
    ),
  )

  useEffect(() => {
    const getLocalSafes = () => {
      Object.values(ETHEREUM_NETWORK).forEach(async (id) => {
        const localSafe = await getLocalNetworkSafesById(id)
        setLocalSafes((prevSafes) => ({
          ...prevSafes,
          ...(localSafe && { [id]: localSafe }),
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

          const localNetworkSafes = localSafes?.[id] ? localSafes[id] : []

          const addedSafeObjects: SafeRecordWithNames[] | SafeRecordProps[] = isCurrentNetwork
            ? safes
            : localNetworkSafes
          const ownedSafeObjects: Pick<SafeRecordProps, 'address'>[] | SafeRecordProps[] = isCurrentNetwork
            ? ownedSafes.map((address) => ({ address }))
            : localNetworkSafes

          const nativeCoinSymbol = getNetworkConfigById(id)?.network?.nativeCoin?.symbol ?? 'ETH'
          const shouldExpandSafesNotAdded = ownedSafeObjects?.some(({ address }) => isSafeAdded(safes, address))

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
                      {ownedSafeObjects?.map((safe) => (
                        <SafeListItem
                          key={safe.address}
                          onSafeClick={onSafeClick}
                          nativeCoinSymbol={nativeCoinSymbol}
                          safes={safes}
                          {...safe}
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
