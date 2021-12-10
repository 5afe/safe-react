import { Text, Icon } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import Link from 'src/components/layout/Link'
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

const StyledIcon = styled(Icon)<{ checked: boolean }>`
  ${({ checked }) => (checked ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  & > div > p:first-of-type {
    width: 210px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  ethBalance,
  showAddSafeLink = false,
  networkId,
  shouldScrollToSafe = false,
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
      safeRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  const routesSlug: SafeRouteParams = {
    shortName,
    safeAddress: address,
  }

  const handleOpenSafe = (): void => {
    onSafeClick()
    onNetworkSwitch?.()
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug))
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
      <StyledPrefixedEthHashInfo hash={address} name={safeName} shortName={shortName} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {ethBalance ? (
          `${formatAmount(ethBalance)} ${nativeCurrencySymbol}`
        ) : showAddSafeLink ? (
          <Link to={generateSafeRoute(LOAD_SPECIFIC_SAFE_ROUTE, routesSlug)} onClick={handleLoadSafe}>
            <Text size="sm" color="primary">
              Add Safe
            </Text>
          </Link>
        ) : null}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default SafeListItem
