import { Text, Icon, Button, Identicon } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'
import { Box } from '@material-ui/core'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { setChainId } from 'src/logic/config/utils'
import { generateSafeRoute, LOAD_SPECIFIC_SAFE_ROUTE, SAFE_ROUTES, SafeRouteParams } from 'src/routes/routes'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain.d'
import { getChainById } from 'src/config'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { SafeOwner } from 'src/logic/safe/store/models/safe'
import Threshold from 'src/components/AppLayout/Sidebar/Threshold'

const StyledIcon = styled(Icon)<{ checked: boolean }>`
  ${({ checked }) => (checked ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

const StyledButton = styled(Button)`
  &.MuiButton-root.MuiButton-text {
    padding: 8px 16px;
    min-width: auto;
    height: 100%;

    &:hover {
      background-color: #cbf1eb;
    }
  }
`

const StyledText = styled(Text)`
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  & > div > p:first-of-type {
    width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & img {
    display: block;
  }
`

type Props = {
  onSafeClick: () => void
  onNetworkSwitch?: () => void
  address: string
  ethBalance?: string
  showAddSafeLink?: boolean
  networkId: ChainId
  shouldScrollToSafe?: boolean
  threshold?: number
  owners?: SafeOwner[]
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  ethBalance,
  showAddSafeLink = false,
  networkId,
  shouldScrollToSafe = false,
  threshold,
  owners,
}: Props): ReactElement => {
  const history = useHistory()
  const safeName = useSelector((state) => addressBookName(state, { address, chainId: networkId }))
  const { safeAddress: currentSafeAddress } = useSafeAddress()
  const currChainId = useSelector(currentChainId)
  const isCurrentSafe = currChainId === networkId && sameAddress(currentSafeAddress, address)
  const safeRef = useRef<HTMLDivElement>(null)

  const { nativeCurrency, shortName } = getChainById(networkId)
  const nativeCurrencySymbol = nativeCurrency?.symbol ?? 'ETH'

  useEffect(() => {
    if (isCurrentSafe && shouldScrollToSafe) {
      safeRef?.current?.scrollIntoView({ block: 'center' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  const routesSlug: SafeRouteParams = {
    shortName,
    safeAddress: address,
  }

  const handleOpenSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(SAFE_ROUTES.DASHBOARD, routesSlug))
  }

  const handleLoadSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(LOAD_SPECIFIC_SAFE_ROUTE, routesSlug))

    // Navigating to LOAD_SPECIFIC_SAFE_ROUTE doesn't trigger a network switch
    setChainId(networkId)
  }

  return (
    <ListItem button onClick={handleOpenSafe} ref={safeRef}>
      <StyledIcon type="check" size="md" color="primary" checked={isCurrentSafe} />
      <AddressContainer>
        <Box position="relative">
          {threshold && owners && <Threshold threshold={threshold} owners={owners.length} size={11} />}
          <Identicon address={address} size="md" />
        </Box>
        <StyledPrefixedEthHashInfo hash={address} name={safeName} shortName={shortName} shortenHash={4} />
      </AddressContainer>
      <ListItemSecondaryAction>
        {ethBalance ? (
          <StyledText size="lg">
            {formatAmount(ethBalance)} {nativeCurrencySymbol}
          </StyledText>
        ) : showAddSafeLink ? (
          <StyledButton onClick={handleLoadSafe} size="md" variant="outlined">
            <Text size="lg" color="primary">
              Add Safe
            </Text>
          </StyledButton>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default SafeListItem
