import { EthHashInfo, Text, Icon } from '@gnosis.pm/safe-react-components'
import { useEffect, useRef, ReactElement } from 'react'
import { useHistory, generatePath } from 'react-router'
import ListItem from '@material-ui/core/ListItem/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction'
import styled from 'styled-components'

import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES, LOAD_ADDRESS } from 'src/routes/routes'
import Link from 'src/components/layout/Link'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { useSelector } from 'react-redux'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { safeAddressFromUrl, SafeRecordWithNames } from 'src/logic/safe/store/selectors'
import { isSafeAdded } from 'src/logic/safe/utils/safeInformation'

const StyledIcon = styled(Icon)<{ checked: boolean }>`
  ${({ checked }) => (checked ? { marginRight: '4px' } : { visibility: 'hidden', width: '28px' })}
`

type Props = {
  onSafeClick: () => void
  onNetworkSwitch?: () => void
  address: string
  ethBalance?: string
  nativeCoinSymbol: string
  safes: SafeRecordWithNames[]
}

const SafeListItem = ({
  onSafeClick,
  onNetworkSwitch,
  address,
  ethBalance,
  nativeCoinSymbol,
  safes,
}: Props): ReactElement => {
  const history = useHistory()
  const safeName = useSelector((state) => addressBookEntryName(state, { address }))
  const currentSafeAddress = useSelector(safeAddressFromUrl)
  const isCurrentSafe = sameAddress(currentSafeAddress, address)
  const safeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isCurrentSafe) return
    safeRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isCurrentSafe])

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
    <ListItem button onClick={handleOpenSafe} ref={safeRef}>
      <StyledIcon type="check" size="md" color="primary" checked={isCurrentSafe} />
      <EthHashInfo hash={address} name={safeName} showAvatar shortenHash={4} />
      <ListItemSecondaryAction>
        {ethBalance ? (
          `${formatAmount(ethBalance)} ${nativeCoinSymbol}`
        ) : !isSafeAdded(safes, address) ? (
          <Link to={`${LOAD_ADDRESS}/${address}`} onClick={handleLoadSafe}>
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
