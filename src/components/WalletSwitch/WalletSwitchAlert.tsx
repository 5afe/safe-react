import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import WalletSwitchButton from './WalletSwitchButton'

const StyledAlert = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5em;
  border-bottom: 1px solid ${({ theme }) => theme.colors.separator};
`

const WalletSwitchAlert = (): ReactElement | null => {
  const isWrongNetwork = useSelector(shouldSwitchWalletChain)

  return isWrongNetwork ? (
    <StyledAlert>
      <WalletSwitchButton />
    </StyledAlert>
  ) : null
}

export default WalletSwitchAlert
