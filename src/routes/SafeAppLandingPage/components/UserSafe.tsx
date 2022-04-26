import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import { Title, Button, Text } from '@gnosis.pm/safe-react-components'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import SuccessSvg from 'src/assets/icons/safe-created.svg'
import { OPEN_SAFE_ROUTE, SAFE_ROUTES } from 'src/routes/routes'

type UserSafeProps = {
  safeAppUrl: string
}

const UserSafe = ({ safeAppUrl }: UserSafeProps): ReactElement => {
  const userAddress = useSelector(userAccountSelector)

  const openSafeLink = `${OPEN_SAFE_ROUTE}?redirect=${encodeURIComponent(`${SAFE_ROUTES.APPS}?appUrl=${safeAppUrl}`)}`

  const isWalletConnected = !!userAddress
  return (
    <UserSafeContainer>
      <Title size="xs">Use the dApp with your Safe!</Title>
      {isWalletConnected ? (
        <>
          <img alt="Vault" height={92} src={SuccessSvg} />

          <StyledCreateButton size="lg" color="primary" variant="contained" component={Link} to={openSafeLink}>
            <Text size="xl" color="white">
              Create new Safe
            </Text>
          </StyledCreateButton>
        </>
      ) : (
        <ConnectWalletContainer>
          <ConnectWalletButton data-testid="connect-wallet-btn" />
        </ConnectWalletContainer>
      )}
    </UserSafeContainer>
  )
}

export default UserSafe

const UserSafeContainer = styled.div`
  flex: 1 0 50%;

  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledCreateButton = styled(Button)`
  margin-top: 30px;
`

const ConnectWalletContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`
const ConnectWalletButton = styled(ConnectButton)`
  height: 52px;
`
