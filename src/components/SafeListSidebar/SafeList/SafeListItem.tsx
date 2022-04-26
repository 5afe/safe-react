import { Text, Icon, Button } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { primaryLite, primaryActive } from 'src/theme/variables'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { setChainId } from 'src/logic/config/utils'
import {
  generateSafeRoute,
  extractSafeAddress,
  LOAD_SPECIFIC_SAFE_ROUTE,
  SAFE_ROUTES,
  SafeRouteParams,
} from 'src/routes/routes'
import { currentChainId } from 'src/logic/config/store/selectors'
import { ChainId } from 'src/config/chain.d'
import { getChainById } from 'src/config'
import { SafeOwner } from 'src/logic/safe/store/models/safe'

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
  position: relative;
`

const Threshold = styled.div`
  background: ${primaryLite};
  color: ${primaryActive};
  font-size: 10px;
  font-weight: bold;
  border-radius: 100%;
  padding: 2px;
  position: absolute;
  z-index: 2;
  top: -5px;
  left: -5px;
  min-width: 20px;
  min-height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
  const currentSafeAddress = extractSafeAddress()
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
        {threshold && owners && (
          <Threshold>
            {threshold}/{owners.length}
          </Threshold>
        )}
        <StyledPrefixedEthHashInfo hash={address} name={safeName} shortName={shortName} showAvatar shortenHash={4} />
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
