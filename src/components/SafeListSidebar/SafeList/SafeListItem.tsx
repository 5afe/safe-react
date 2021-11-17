import { EthHashInfo, Text, Icon } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import Link from 'src/components/layout/Link'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector, useDispatch } from 'react-redux'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import {
  generateSafeRoute,
  extractSafeAddress,
  LOAD_SPECIFIC_SAFE_ROUTE,
  SAFE_ROUTES,
  SafeRouteParams,
} from 'src/routes/routes'
import { getNetworkById } from 'src/logic/config/store/selectors'
import { AppReduxState } from 'src/store'
import { setNetworkId } from 'src/logic/config/store/actions'
import { ETHEREUM_NETWORK } from 'src/types/network'

const StyledIcon = styled(Icon)<{ checked: boolean }>`
  ${({ checked }) => (checked ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

const StyledEthHashInfo = styled(EthHashInfo)`
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
  networkId: ETHEREUM_NETWORK
  shouldScrollToSafe?: boolean
}

const SafeListItem = ({
  onSafeClick,
  address,
  ethBalance,
  showAddSafeLink = false,
  networkId,
  shouldScrollToSafe = false,
}: Props): ReactElement => {
  const dispatch = useDispatch()
  const history = useHistory()
  const safeName = useSelector((state) => addressBookName(state, { address, chainId: networkId }))
  const currentSafeAddress = extractSafeAddress()
  const isCurrentSafe = sameAddress(currentSafeAddress, address)
  const safeRef = useRef<HTMLDivElement>(null)
  const { nativeCurrency, shortName } = useSelector((state: AppReduxState) => getNetworkById(state, networkId))

  const routesSlug: SafeRouteParams = {
    shortName,
    safeAddress: address,
  }

  const handleOpenSafe = (): void => {
    onSafeClick()
    dispatch(setNetworkId(networkId))
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug))
  }

  const handleLoadSafe = (): void => {
    onSafeClick()
    dispatch(setNetworkId(networkId))
    history.push(generateSafeRoute(LOAD_SPECIFIC_SAFE_ROUTE, routesSlug))
  }

  useEffect(() => {
    if (isCurrentSafe && shouldScrollToSafe) {
      safeRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  return (
    <ListItem button onClick={handleOpenSafe} ref={safeRef}>
      <StyledIcon type="check" size="md" color="primary" checked={isCurrentSafe} />
      <StyledEthHashInfo hash={address} name={safeName} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {ethBalance ? (
          `${formatAmount(ethBalance)} ${nativeCurrency.symbol}`
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
