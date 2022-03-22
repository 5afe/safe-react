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
          <Link href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">Gnosis Safe app</Link> to sign
          transactions with your mobile device.
          <br />
          <Link href="https://help.gnosis-safe.io/en/articles/5584901-desktop-pairing">Learn more</Link> about this
          feature.
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        <a href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">
          <img
            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1599436800&h=93244e063e3bdf5b5b9f93aff647da09"
            alt="Download on the App Store"
            className={classes.appStore}
          />
        </a>
      </Row>
    </>
  )
}

export default PairingDetails
