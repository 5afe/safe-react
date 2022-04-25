import { ReactElement } from 'react'
import { Divider, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import usePairing from 'src/logic/wallets/pairing/hooks/usePairing'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import Track from 'src/components/Track'
import AppstoreButton from 'src/components/AppstoreButton'

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin-left: -20px;
`

const QR_DIMENSION = 120

const PairingDetails = ({ classes }: { classes: Record<string, string> }): ReactElement => {
  const { uri } = usePairing()

  return (
    <>
      <StyledDivider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin>
          Connect to Mobile
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        <QRCode value={uri} size={QR_DIMENSION} />
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
