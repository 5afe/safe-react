import { ReactElement } from 'react'
import { Skeleton } from '@material-ui/lab'
import { Divider, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import usePairing from 'src/logic/wallets/pairing/hooks/usePairing'
import onboard from 'src/logic/wallets/onboard'
import { getPairingUri, isPairingConnected } from 'src/logic/wallets/pairing/utils'

// Hides first wallet in Onboard modal (pairing module)
import 'src/components/AppLayout/Header/components/ProviderDetails/hidePairingModule.css'

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin-left: -20px;
`

const PairingDetails = ({ classes }): ReactElement => {
  usePairing()

  const uri = onboard().getState().wallet.provider?.wc?.uri

  return (
    <>
      <StyledDivider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin>
          Connect to Mobile
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        {isPairingConnected() ? (
          <QRCode value={getPairingUri(uri)} size={120} />
        ) : (
          <Skeleton variant="rect" width={120} height={120} />
        )}
      </Row>

      <Row>
        <Paragraph className={classes.centerText} size="sm">
          Scan this code in the{' '}
          <Link href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">Gnosis Safe app</Link> to sign
          transactions with your mobile device.
          <br />
          {/* @TODO: Link */}
          <Link href="#">Learn more</Link> about this feature.
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
