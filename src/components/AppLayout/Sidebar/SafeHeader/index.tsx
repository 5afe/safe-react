import React from 'react'
import styled from 'styled-components'
import {
  Icon,
  FixedIcon,
  EthHashInfo,
  Text,
  Identicon,
  Button,
  CopyToClipboardBtn,
  ExplorerButton,
} from '@gnosis.pm/safe-react-components'

import ButtonHelper from 'src/components/ButtonHelper'
import FlexSpacer from 'src/components/FlexSpacer'
import { getExplorerInfo, getNetworkInfo } from 'src/config'
import { NetworkSettings } from 'src/config/networks/network.d'
import { border, fontColor } from 'src/theme/variables'

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
  align-items: center;

  div:first-of-type {
    width: 32px;
  }
`
const StyledIcon = styled(Icon)`
  svg {
    height: 26px;
    width: 26px;
  }
`

const IconContainer = styled.div`
  width: 100px;
  display: flex;
  padding: 4px 0;
  justify-content: space-evenly;
`
const StyledButton = styled(Button)`
  &&.MuiButton-root {
    padding: 0 12px;
  }
  *:first-child {
    margin: 0 4px 0 0;
  }
`

type StyledTextLabelProps = {
  networkInfo: NetworkSettings
}

const StyledTextLabel = styled(Text)`
  margin: -8px 0 4px -8px;
  padding: 4px 8px;
  width: 100%;
  text-align: center;
  color: ${(props: StyledTextLabelProps) => props.networkInfo?.textColor ?? fontColor};
  background-color: ${(props: StyledTextLabelProps) => props.networkInfo?.backgroundColor ?? border};
`
const StyledEthHashInfo = styled(EthHashInfo)`
  p {
    color: ${({ theme }) => theme.colors.placeHolder};
    font-size: 14px;
  }
`

const StyledLabel = styled.div`
  background-color: ${({ theme }) => theme.colors.icon};
  margin: 4px 0 0 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
  p {
    line-height: 18px;
  }
`
const StyledText = styled(Text)`
  margin: 8px 0 16px 0;
`

type Props = {
  address: string | undefined
  safeName: string | undefined
  granted: boolean
  balance: string | undefined
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

const SafeHeader = ({
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
          <FlexSpacer />
          <FixedIcon type="notConnected" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <Icon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>
      </Container>
    )
  }
  const explorerUrl = getExplorerInfo(address)
  const networkInfo = getNetworkInfo()

  return (
    <>
      {/* Network */}
      <StyledTextLabel size="sm" networkInfo={networkInfo}>
        {networkInfo.label}
      </StyledTextLabel>

      <Container>
        {/* Identicon */}
        <IdenticonContainer>
          <FlexSpacer />
          <Identicon address={address} size="lg" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <StyledIcon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>

        {/* SafeInfo */}
        <Text size="xl">{safeName}</Text>
        <StyledEthHashInfo hash={address} shortenHash={4} textSize="sm" />
        <IconContainer>
          <ButtonHelper onClick={onReceiveClick}>
            <Icon size="sm" type="qrCode" tooltip="Show QR" />
          </ButtonHelper>
          <CopyToClipboardBtn textToCopy={address} />
          <ExplorerButton explorerUrl={explorerUrl} />
        </IconContainer>

        {granted ? null : (
          <StyledLabel>
            <Text size="sm" color="white">
              READ ONLY
            </Text>
          </StyledLabel>
        )}

        <StyledText size="xl">{balance}</StyledText>
        <StyledButton size="md" disabled={!granted} color="primary" variant="contained" onClick={onNewTransactionClick}>
          <FixedIcon type="arrowSentWhite" />
          <Text size="xl" color="white">
            New transaction
          </Text>
        </StyledButton>
      </Container>
    </>
  )
}

export default SafeHeader
