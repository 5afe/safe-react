import { EthHashInfo, Text, Icon } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useHistory, generatePath } from 'react-router'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES, LOAD_ADDRESS } from 'src/routes/routes'
import Link from 'src/components/layout/Link'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'

const StyledIcon = styled(Icon)<{ isSameAddress: boolean }>`
  ${({ isSameAddress }) => (isSameAddress ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

type Props = {
  onSafeClick: () => void
  onNetworkSwitch?: () => void
  address: string
  ethBalance?: string
  currentSafeAddress?: string
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  ethBalance,
  currentSafeAddress,
}: Props): React.ReactElement => {
  const history = useHistory()
  const safeName = useSelector((state) => addressBookEntryName(state, { address }))

  const handleLoadSafe = (): void => {
    onNetworkSwitch?.()
    onSafeClick()
  }

  const handleOpenSafe = (): void => {
    handleLoadSafe()
    history.push(
      generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
        safeAddress: address,
      }),
    )
  }

  return (
    <ListItem button onClick={handleOpenSafe}>
      <StyledIcon type="check" size="md" color="primary" isSameAddress={sameAddress(currentSafeAddress, address)} />
      <EthHashInfo hash={address} name={safeName} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {ethBalance ? (
          `${formatAmount(ethBalance)} ETH`
        ) : (
          <Link to={`${LOAD_ADDRESS}/${address}`} onClick={handleLoadSafe}>
            <Text size="sm" color="primary">
              Add Safe
            </Text>
          </Link>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default SafeListItem
