import { EthHashInfo, Text, Icon } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import Link from 'src/components/layout/Link'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import { getNetworkConfigById, getShortChainNameById } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/config/networks/network.d'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'
import {
  generateSafeRoute,
  extractSafeAddress,
  LOAD_SPECIFIC_SAFE_ROUTE,
  SAFE_ROUTES,
  SafeRouteParams,
} from 'src/routes/routes'

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
  loadedSafes: SafeRecordWithNames[]
  networkId: ETHEREUM_NETWORK
  shouldScrollToSafe?: boolean
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  ethBalance,
  loadedSafes,
  networkId,
  shouldScrollToSafe = false,
}: Props): ReactElement => {
  const history = useHistory()
  const safeName = useSelector((state) => addressBookName(state, { address, chainId: networkId }))
  const currentSafeAddress = extractSafeAddress()
  const isCurrentSafe = sameAddress(currentSafeAddress, address)
  const safeRef = useRef<HTMLDivElement>(null)
  const nativeCoinSymbol = getNetworkConfigById(networkId)?.network?.nativeCoin?.symbol ?? 'ETH'
  const showAddSafeLink = !isSafeAdded(loadedSafes, address)

  useEffect(() => {
    if (isCurrentSafe && shouldScrollToSafe) {
      safeRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCurrentSafe, shouldScrollToSafe])

  const handleLoadSafe = (): void => {
    onNetworkSwitch?.()
    onSafeClick()
  }

  const routesSlug: SafeRouteParams = {
    shortName: getShortChainNameById(networkId),
    safeAddress: address,
  }

  const handleOpenSafe = (): void => {
    handleLoadSafe()
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, routesSlug))
  }

  return (
    <ListItem button onClick={handleOpenSafe} ref={safeRef}>
      <StyledIcon type="check" size="md" color="primary" checked={isCurrentSafe} />
      <StyledEthHashInfo hash={address} name={safeName} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {ethBalance ? (
          `${formatAmount(ethBalance)} ${nativeCoinSymbol}`
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
