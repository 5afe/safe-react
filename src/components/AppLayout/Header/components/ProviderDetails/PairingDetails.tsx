import { CSSProperties, ReactElement, useState } from 'react'
import styled from 'styled-components'
import Skeleton from '@material-ui/lab/Skeleton'
import RefreshIcon from '@material-ui/icons/Refresh'
import IconButton from '@material-ui/core/IconButton'
import { Link } from '@gnosis.pm/safe-react-components'
import QRCode from 'qrcode.react'

import Paragraph from 'src/components/layout/Paragraph'
import { getPairingUri, initPairing, isPairingModule } from 'src/logic/wallets/pairing/utils'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from 'src/components/Track'
import AppstoreButton from 'src/components/AppstoreButton'
import { Divider } from '@material-ui/core'

const QR_DIMENSION = 120

const qrRefresh: CSSProperties = {
  width: QR_DIMENSION,
  height: QR_DIMENSION,
}

const StyledContainer = styled.div<{
  $vertical: boolean
}>`
  max-width: 375px;
  display: flex;
  gap: ${(props) => (props.$vertical ? '12px' : '24px')};
  flex-flow: ${(props) => (props.$vertical ? 'column wrap' : 'row nowrap')};
  align-items: ${(props) => (props.$vertical ? 'center' : '')};

  div {
    align-items: ${(props) => (props.$vertical ? 'center' : '')};
    text-align: ${(props) => (props.$vertical ? 'center' : '')};
  }
`

const StyledTitle = styled.h5`
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.4px;
  margin: 0;
  color: #06fc99;
`

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin: 0 -20px;
`

const StyledContent = styled.div`
  display: flex;
  flex-flow: column wrap;
`

const StyledQr = styled.div`
  align-self: center;

  img,
  canvas {
    display: block;
  }
`

type PairingDetailsProps = {
  vertical?: boolean
}

const PairingDetails = ({ vertical = false }: PairingDetailsProps): ReactElement => {
  const [uri, setUri] = useState<string | undefined>(getPairingUri())
  const isPairingLoaded = isPairingModule()

  const onRefresh = async (): Promise<void> => {
    await initPairing()
    setUri(getPairingUri())
  }

  const qr = (
    <StyledQr>
      {uri ? (
        <QRCode
          value={uri}
          includeMargin
          imageSettings={{ src: './resources/logo-white-bg.png', width: 30, height: 30 }}
        />
      ) : isPairingLoaded ? (
        <Skeleton variant="rect" width={QR_DIMENSION} height={QR_DIMENSION} />
      ) : (
        <IconButton disableRipple style={qrRefresh} onClick={onRefresh}>
          <RefreshIcon fontSize="large" />
        </IconButton>
      )}
    </StyledQr>
  )

  const title = <StyledTitle>Connect to Mobile</StyledTitle>

  const content = (
    <StyledContent>
      <Paragraph size="sm" color='#06fc99'>
        Scan this code in the Safe mobile app to sign transactions with your mobile device.{' '}
        <Link href="https://help.gnosis-safe.io/en/articles/5584901-desktop-pairing">
          Learn more about this feature.
        </Link>
      </Paragraph>

      <Track {...OVERVIEW_EVENTS.IPHONE_APP_BUTTON}>
        <AppstoreButton placement="pairing" />
      </Track>
    </StyledContent>
  )

  return (
    <StyledContainer $vertical={vertical}>
      {vertical ? (
        <>
          <StyledDivider />
          {title}
          {qr}
          {content}
        </>
      ) : (
        <>
          {qr}
          <div>
            {title}
            {content}
          </div>
        </>
      )}
    </StyledContainer>
  )
}

export default PairingDetails
