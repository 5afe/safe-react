import { CSSProperties, ReactElement } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import RefreshIcon from '@material-ui/icons/Refresh'
import IconButton from '@material-ui/core/IconButton'
import { Divider, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import usePairing from 'src/logic/wallets/pairing/hooks/usePairing'
import { initPairing, isPairingModule } from 'src/logic/wallets/pairing/utils'
import { useGetPairingUri } from 'src/logic/wallets/pairing/hooks/useGetPairingUri'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from 'src/components/Track'
import AppstoreButton from 'src/components/AppstoreButton'

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin-left: -20px;
`

const QR_DIMENSION = 120

const qrRefresh: CSSProperties = {
  width: QR_DIMENSION,
  height: QR_DIMENSION,
}

const PairingDetails = ({ classes }: { classes: Record<string, string> }): ReactElement => {
  const uri = useGetPairingUri()
  const isPairingLoaded = isPairingModule()
  usePairing()

  return (
    <>
      <StyledDivider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin>
          Connect to Mobile
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        {uri ? (
          <QRCode value={uri} size={QR_DIMENSION} />
        ) : isPairingLoaded ? (
          <Skeleton variant="rect" width={QR_DIMENSION} height={QR_DIMENSION} />
        ) : (
          <IconButton disableRipple style={qrRefresh} onClick={initPairing}>
            <RefreshIcon fontSize="large" />
          </IconButton>
        )}
      </Row>

      <Row>
        <Paragraph className={classes.centerText} size="sm">
          Scan this code in the{' '}
          <Track {...OVERVIEW_EVENTS.IPHONE_APP_BUTTON}>
            <Link href="https://apps.apple.com/app/apple-store/id1515759131?pt=119497694&ct=Web%20App%20Connect&mt=8">
              Gnosis Safe app
            </Link>
          </Track>{' '}
          to sign transactions with your mobile device.
          <br />
          <Link href="https://help.gnosis-safe.io/en/articles/5584901-desktop-pairing">Learn more</Link> about this
          feature.
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        <Track {...OVERVIEW_EVENTS.IPHONE_APP_BUTTON}>
          <AppstoreButton placement="pairing" />
        </Track>
      </Row>
    </>
  )
}

export default PairingDetails
