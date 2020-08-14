import React from 'react'
import styled from 'styled-components'
import { getNetwork } from 'src/config'

import {
  Icon,
  FixedIcon,
  EthHashInfo,
  Text,
  Identicon,
  Button,
  CopyToClipboardBtn,
  EtherscanButton,
} from '@gnosis.pm/safe-react-components'

export const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'

const Container = styled.div`
  max-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const IdenticonContainer = styled.div`
  width: 100%;
  margin: 8px;
  display: flex;
  justify-content: space-between;

  div:first-of-type {
    width: 32px;
  }
`

const IconContainer = styled.div`
  width: 100px;
  display: flex;
  padding: 8px 0;
  justify-content: space-evenly;
`
const StyledButton = styled(Button)`
  *:first-child {
    margin: 0 4px 0 0;
  }
`
const StyledLabel = styled.div`
  background-color: ${({ theme }) => theme.colors.icon};
  margin: 8px 0 0 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
`
const StyledText = styled(Text)`
  margin: 8px 0 16px 0;
`
const UnStyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline-color: ${({ theme }) => theme.colors.separator};
  display: flex;
  align-items: center;
`

type Props = {
  address: string | null
  safeName: string
  granted: boolean
  balance: string | null
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

const WalletInfo = ({
  address,
  safeName,
  balance,
  granted,
  onToggleSafeList,
  onReceiveClick,
  onNewTransactionClick,
}: Props): React.ReactElement => {
  if (!address) {
    return (
      <Container>
        <IdenticonContainer>
          <div></div>
          <div>
            <FixedIcon type="notConnected" />
          </div>
          <UnStyledButton onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <Icon size="md" type="circleDropdown" />
          </UnStyledButton>
        </IdenticonContainer>
        NO SAFE LOADED
      </Container>
    )
  }

  return (
    <Container>
      <IdenticonContainer>
        <div></div>
        <Identicon address={address} size="lg" />
        <UnStyledButton onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
          <Icon size="md" type="circleDropdown" />
        </UnStyledButton>
      </IdenticonContainer>

      <Text size="xl">{safeName}</Text>
      <EthHashInfo hash={address} shortenHash={4} textSize="sm" />
      <IconContainer>
        <UnStyledButton onClick={onReceiveClick}>
          <Icon size="sm" type="qrCode" tooltip="receive" />
        </UnStyledButton>
        <CopyToClipboardBtn textToCopy={address} />
        <EtherscanButton value={address} network={getNetwork()} />
      </IconContainer>

      {granted ? null : (
        <StyledLabel>
          <Text size="sm" color="white">
            READ ONLY
          </Text>
        </StyledLabel>
      )}

      <StyledText size="xl">{balance}</StyledText>
      <StyledButton
        size="md"
        // iconType="transactionsInactive"
        color="primary"
        variant="contained"
        onClick={onNewTransactionClick}
      >
        <FixedIcon type="arrowSentWhite" />
        <Text size="lg" color="white">
          New Transaction
        </Text>
      </StyledButton>
    </Container>
  )
}

export default WalletInfo
