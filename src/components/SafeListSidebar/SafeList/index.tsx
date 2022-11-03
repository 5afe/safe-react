import MuiList from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import styled from 'styled-components'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { Fragment, ReactElement, useEffect } from 'react'
import { Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import uniqBy from 'lodash/uniqBy'

import Collapse from 'src/components/Collapse'
import SafeListItem from './SafeListItem'
import useLocalSafes from 'src/logic/safe/hooks/useLocalSafes'
import { WELCOME_ROUTE } from 'src/routes/routes'
import { SafeRecordProps } from 'src/logic/safe/store/models/safe'
import { setChainId } from 'src/logic/config/utils'
import { useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import useOwnerSafes from 'src/logic/safe/hooks/useOwnerSafes'
import { getChains } from 'src/config/cache/chains'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import { trackEvent } from 'src/utils/googleTagManager'
import { getChainById } from 'src/config'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

const MAX_EXPANDED_SAFES = 3

const StyledDot = styled.span<{ backgroundColor: string; textColor: string }>`
  width: 15px;
  height: 15px;
  color: #06fc99;
  background-color: #06fc99;
  border-radius: 50%;
  display: inline-block;
  margin-right: 6px;
`

const StyledList = styled(MuiList)`
  height: '100%';
  overflow-x: 'hidden';
  overflow-y: 'auto';
  padding: 0;
  background-color: #000;
  color: #06fc99;

  & p > a {
    color: #06fc99;
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
  color: #06fc99;
`

type Props = {
  onSafeClick: () => void
}

const isNotLoadedViaUrl = ({ loadedViaUrl }: SafeRecordProps) => loadedViaUrl === false

const isSameAddress = (addrA: string, addrB: string): boolean => addrA.toLowerCase() === addrB.toLowerCase()

export const SafeList = ({ onSafeClick }: Props): ReactElement => {
  const classes = useStyles()
  const { safeAddress } = useSafeAddress()
  const ownedSafes = useOwnerSafes()
  const localSafes = useLocalSafes()
  const curChainId = useSelector(currentChainId)

  useEffect(() => {
    const addedSafes = localSafes?.[curChainId]?.length || 0
    if (addedSafes === 0) {
      return
    }
    const event = OVERVIEW_EVENTS.ADDED_SAFES_ON_NETWORK
    trackEvent({
      ...event,
      action: `${event.action} ${getChainById(curChainId).chainName}`,
      label: addedSafes,
    })
  }, [localSafes, curChainId])

  return (
    <StyledList>
      {getChains().map(({ chainId, theme, chainName }) => {
        const isCurrentNetwork = chainId === curChainId
        const ownedSafesOnNetwork = ownedSafes[chainId] || []
        const localSafesOnNetwork = uniqBy(localSafes[chainId].filter(isNotLoadedViaUrl), ({ address }) =>
          address.toLowerCase(),
        )

        if (!isCurrentNetwork && !ownedSafesOnNetwork.length && !localSafesOnNetwork.length) {
          return null
        }

        let shouldExpandOwnedSafes = false
        if (isCurrentNetwork && ownedSafesOnNetwork.includes(safeAddress)) {
          // Expand the Owned Safes if the current Safe is owned, but not added
          shouldExpandOwnedSafes = !localSafesOnNetwork.some(({ address }) => isSameAddress(address, safeAddress))
        } else {
          // Expand the Owned Safes if there are no added Safes
          shouldExpandOwnedSafes = !localSafesOnNetwork.length && ownedSafesOnNetwork.length <= MAX_EXPANDED_SAFES
        }

        return (
          <Fragment key={chainId}>
            <ListItem selected>
              <StyledDot {...theme} className="networkLabel" />
              {chainName}
            </ListItem>
            <MuiList>
              {localSafesOnNetwork.map((safe) => (
                <SafeListItem
                  key={safe.address}
                  networkId={chainId}
                  onNetworkSwitch={() => setChainId(chainId)}
                  onSafeClick={onSafeClick}
                  shouldScrollToSafe
                  {...safe}
                />
              ))}

              {!localSafesOnNetwork.length && !ownedSafesOnNetwork.length && (
                <PlaceholderText size="lg">
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
                        color="primary"
                      >{`Safes owned on ${chainName} (${ownedSafesOnNetwork.length})`}</Text>
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
                          networkId={chainId}
                          onSafeClick={onSafeClick}
                          showAddSafeLink={!isAdded}
                          shouldScrollToSafe={shouldExpandOwnedSafes && !isAdded}
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
