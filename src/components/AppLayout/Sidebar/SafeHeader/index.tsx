import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  Icon,
  FixedIcon,
  Text,
  Identicon,
  Button,
  CopyToClipboardBtn,
  ExplorerButton,
} from '@gnosis.pm/safe-react-components'
import { useRouteMatch } from 'react-router-dom'

import ButtonHelper from 'src/components/ButtonHelper'
import FlexSpacer from 'src/components/FlexSpacer'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { border, fontColor } from 'src/theme/variables'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { copyShortNameSelector } from 'src/logic/appearance/selectors'
import { ADDRESSED_ROUTE, extractShortChainName } from 'src/routes/routes'
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
  margin: 8px;
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
  chainInfo: ChainInfo
}

const StyledTextLabel = styled(Text)`
  margin: -8px 0 4px -8px;
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
        <StyledTextSafeName size="lg" center>
          {safeName}
        </StyledTextSafeName>
        <StyledPrefixedEthHashInfo hash={address} shortenHash={4} textSize="sm" />
        <IconContainer>
          <ButtonHelper onClick={onReceiveClick}>
            <Icon size="sm" type="qrCode" tooltip="Show QR" />
          </ButtonHelper>
          <CopyToClipboardBtn textToCopy={copyChainPrefix ? `${shortName}:${address}` : `${address}`} />
          <ExplorerButton explorerUrl={getExplorerInfo(address)} />
        </IconContainer>

        {!granted && (
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
