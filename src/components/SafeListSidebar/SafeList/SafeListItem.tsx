import { EthHashInfo, Icon } from '@gnosis.pm/safe-react-components'
import ListItem from '@material-ui/core/ListItem/ListItem'
import React from 'react'
import { useSelector } from 'react-redux'
import { generatePath, useHistory } from 'react-router'
import { addressBookName } from 'src/logic/addressBook/store/selectors'
import { sameAddress } from 'src/logic/wallets/ethAddresses'
import { SAFE_ROUTES } from 'src/routes/routes'
import styled from 'styled-components'

type StyledIconProps = { isSameAddress: boolean } & React.ComponentProps<typeof Icon>
const StyledIcon = styled(({ isSameAddress, ...props }) => <Icon {...props} />)<StyledIconProps>`
  && {
    margin-right: 4px;
    ${({ isSameAddress }) =>
      isSameAddress
        ? `
            visibility: 'hidden',
            width: '28px'
          `
        : ``}
  }
`

type Props = {
  address: string
  onSafeClick: () => void
  currentSafeAddress: string | undefined
}

const SafeListItem = ({ address, onSafeClick, currentSafeAddress }: Props) => {
  const history = useHistory()
  const name = useSelector((state) => addressBookName(state, { address }))
  const isSameAddress = sameAddress(currentSafeAddress, address)

  const handleSafeClick = () => {
    onSafeClick()
    return history.push(
      generatePath(SAFE_ROUTES.ASSETS_BALANCES, {
        safeAddress: address,
      }),
    )
  }

  return (
    <ListItem button onClick={handleSafeClick}>
      <StyledIcon type="check" size="md" color="primary" isSameAddress={isSameAddress} test="t" />
      <EthHashInfo hash={address} name={name} showAvatar shortenHash={4} />
    </ListItem>
  )
}

export default SafeListItem
