import { ReactElement } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Divider, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import usePairing from 'src/logic/wallets/pairing/hooks/usePairing'
import AppstoreButton from 'src/components/AppstoreButton'

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin-left: -20px;
`

const QR_DIMENSION = 120

const PairingDetails = ({ classes }: { classes: Record<string, string> }): ReactElement => {
  const { uri, isLoaded } = usePairing()

  return (
    <>
      <StyledDivider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin>
          Connect to Mobile
        </Paragraph>
      </Row>
      <Row className={classes.justifyCenter}>
        {isLoaded ? (
          <QRCode value={uri} size={QR_DIMENSION} />
        ) : (
          <Skeleton variant="rect" width={QR_DIMENSION} height={QR_DIMENSION} />
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
        <AppstoreButton placement="pairing" />
      </Row>
    </>
  )
}

export default PairingDetails
