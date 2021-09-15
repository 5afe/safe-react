import { EthHashInfo, Text, Icon } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, generatePath } from 'react-router'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES, LOAD_ADDRESS } from 'src/routes/routes'
import Link from 'src/components/layout/Link'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

const StyledIcon = styled(Icon)<{ isSameAddress: boolean }>`
  ${({ isSameAddress }) => (isSameAddress ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

type Props = {
  onSafeClick: () => void
  onNetworkSwitch?: () => void
  address: string
  name?: string
  totalFiatBalance?: string
  currentSafeAddress?: string
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  name,
  totalFiatBalance,
  currentSafeAddress,
}: Props): React.ReactElement => {
  const history = useHistory()

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

  const currentCurrency = useSelector(currentCurrencySelector)
  // TODO: use formatAmount from SRC when Amount component PR is merged
  const formatCurrency = (balance: string): string =>
    Intl.NumberFormat([], {
      style: 'currency',
      currency: currentCurrency,
      maximumFractionDigits: 2,
    }).format(+balance)

  return (
    <ListItem button onClick={handleOpenSafe}>
      <StyledIcon type="check" size="md" color="primary" isSameAddress={sameAddress(currentSafeAddress, address)} />
      <EthHashInfo hash={address} name={name} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {totalFiatBalance ? (
          formatCurrency(totalFiatBalance)
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
