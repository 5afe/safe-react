import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  Icon,
  FixedIcon,
  Text,
  Title,
  Identicon,
  Button,
  CopyToClipboardBtn,
  ExplorerButton,
} from '@gnosis.pm/safe-react-components'
import { useRouteMatch } from 'react-router-dom'

import ButtonHelper from 'src/components/ButtonHelper'
import FlexSpacer from 'src/components/FlexSpacer'
import Paragraph from 'src/components/layout/Paragraph'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { border, fontColor } from 'src/theme/variables'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { copyShortNameSelector } from 'src/logic/appearance/selectors'
import { ADDRESSED_ROUTE, extractShortChainName } from 'src/routes/routes'
import Track from 'src/components/Track'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Threshold from 'src/components/AppLayout/Sidebar/Threshold'

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
  margin: 14px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  div:first-of-type {
    width: 32px;
  }
`
const StyledIcon = styled(Icon)`
  svg {
    height: 26px;
    width: 26px;
    transform: rotateZ(-90deg);

    path:nth-child(2) {
      display: none;
    }
  }
`

const IconContainer = styled.div`
  width: 100px;
  display: flex;
  gap: 8px;
  justify-content: space-evenly;
  margin: 14px 0;
`
const StyledButton = styled(Button)`
  &&.MuiButton-root {
    padding: 0 12px;
  }
  *:first-child {
    margin: 0 4px 0 0;
  }
`

const StyledExplorerButton = styled(ExplorerButton)`
  border-radius: 5px;
  width: 32px;
  height: 32px;
  background-color: #f0efee;

  & .icon-color {
    transition: fill 0.2s ease-in-out;
  }

  &:hover {
    background-color: #effaf8;
    & .icon-color {
      fill: #008c73;
    }
  }
`

const StyledCopyToClipboardBtn = styled(CopyToClipboardBtn)`
  border-radius: 5px;
  width: 32px;
  height: 32px;
  background-color: #f0efee;

  & .icon-color {
    transition: fill 0.2s ease-in-out;
  }

  &:hover {
    background-color: #effaf8;
    & .icon-color {
      fill: #008c73;
    }
  }
`

const StyledQRCodeButton = styled.button`
  border: 0;
  cursor: pointer;
  border-radius: 5px;
  width: 32px;
  height: 32px;
  background-color: #f0efee;

  & .icon-color {
    transition: fill 0.2s ease-in-out;
  }

  &:hover {
    background-color: #effaf8;
    & .icon-color {
      fill: #008c73;
    }
  }
`

type StyledTextLabelProps = {
  chainInfo: ChainInfo
}

const StyledTextLabel = styled(Text)`
  margin: -8px 0 0 -8px;
  padding: 4px 8px;
  width: 100%;
  text-align: center;
  color: ${(props: StyledTextLabelProps) => props.chainInfo?.theme?.textColor ?? fontColor};
  background-color: ${(props: StyledTextLabelProps) => props.chainInfo?.theme?.backgroundColor ?? border};
`

const StyledTextSafeName = styled(Text)`
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  p {
    color: ${({ theme }) => theme.colors.placeHolder};
    font-size: 14px;
  }
`

const StyledLabel = styled.div`
  background-color: ${({ theme }) => theme.colors.icon};
  margin: 0 0 14px 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
  p {
    line-height: 18px;
  }
`
const StyledText = styled(Title)`
  margin: 0 0 14px 0;
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
  const copyChainPrefix = useSelector(copyShortNameSelector)
  const shortName = extractShortChainName()

  const hasSafeOpen = useRouteMatch(ADDRESSED_ROUTE)

  if (!address || !hasSafeOpen) {
    return (
      <Container>
        <IdenticonContainer>
          <FlexSpacer />
          <FixedIcon type="notConnected" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <StyledIcon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>
      </Container>
    )
  }
  const chainInfo = getChainInfo()

  return (
    <>
      {/* Network */}
      <StyledTextLabel size="sm" chainInfo={chainInfo}>
        {chainInfo.chainName}
      </StyledTextLabel>

      <Container>
        {/* Identicon */}
        <IdenticonContainer>
          <FlexSpacer />
          <Threshold />
          <Identicon address={address} size="lg" />
          <ButtonHelper onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
            <StyledIcon size="md" type="circleDropdown" />
          </ButtonHelper>
        </IdenticonContainer>

        {/* SafeInfo */}
        <StyledTextSafeName size="xl" center>
          {safeName}
        </StyledTextSafeName>
        <StyledPrefixedEthHashInfo hash={address} shortenHash={4} textSize="sm" />
        <IconContainer>
          <Track {...OVERVIEW_EVENTS.SHOW_QR}>
            <StyledQRCodeButton onClick={onReceiveClick}>
              <Icon size="sm" type="qrCode" tooltip="Show QR code" />
            </StyledQRCodeButton>
          </Track>
          <Track {...OVERVIEW_EVENTS.COPY_ADDRESS}>
            <StyledCopyToClipboardBtn textToCopy={copyChainPrefix ? `${shortName}:${address}` : `${address}`} />
          </Track>
          <Track {...OVERVIEW_EVENTS.OPEN_EXPLORER}>
            <StyledExplorerButton explorerUrl={getExplorerInfo(address)} />
          </Track>
        </IconContainer>

        {!granted && (
          <StyledLabel>
            <Text size="sm" color="white">
              READ ONLY
            </Text>
          </StyledLabel>
        )}

        <Paragraph color="black400" noMargin size="md">
          Total Balance
        </Paragraph>
        <StyledText size="xs">{balance}</StyledText>
        <Track {...OVERVIEW_EVENTS.NEW_TRANSACTION}>
          <StyledButton
            size="md"
            disabled={!granted}
            color="primary"
            variant="contained"
            onClick={onNewTransactionClick}
          >
            <FixedIcon type="arrowSentWhite" />
            <Text size="lg" color="white" strong>
              New transaction
            </Text>
          </StyledButton>
        </Track>
      </Container>
    </>
  )
}

export default SafeHeader
