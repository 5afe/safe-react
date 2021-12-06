import { ReactElement } from 'react'
import { Card } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import QRCode from 'qrcode.react'

import ConnectButton from 'src/components/ConnectButton'
import Paragraph from 'src/components/layout/Paragraph'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import useWalletConnect from '../../hooks/useWalletConnect'
import { getChainById } from 'src/config'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: 'row';
  flex: 0 1 100%;
  padding: 0;
`
const CardContainer = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-width: 240px;
  padding: 24px;
  gap: 20px;
`

const StyledParagraph = styled(Paragraph)`
  letter-spacing: -0.6px;
`

const ConnectDetails = (): ReactElement => {
  const { uri, chainId, address } = useWalletConnect()

  const { shortName } = getChainById(chainId)

  return (
    <StyledCard>
      <CardContainer>
        <StyledParagraph noMargin size="xl" weight="bolder">
          Connect to Wallet
        </StyledParagraph>
        <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
        <ConnectButton data-testid="heading-connect-btn" />
      </CardContainer>
      <Divider orientation="vertical" flexItem />
      <CardContainer>
        <StyledParagraph noMargin size="xl" weight="bolder">
          {uri ? 'Connected to Mobile' : 'Connect to Mobile'}
        </StyledParagraph>
        {!chainId ? (
          <>
            <QRCode size={100} value={uri} />
            <a href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">
              <img
                src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1599436800&h=93244e063e3bdf5b5b9f93aff647da09"
                alt="Download on the App Store"
                style={{ height: 35 }}
              />
            </a>
          </>
        ) : (
          <PrefixedEthHashInfo hash={address} shortName={shortName} showAvatar showCopyBtn shortenHash={4} />
        )}
      </CardContainer>
    </StyledCard>
  )
}

export default ConnectDetails
