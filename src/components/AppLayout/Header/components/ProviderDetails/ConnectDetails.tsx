import { ReactElement } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card, Divider, Link } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import QRCode from 'qrcode.react'

import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import usePairing from 'src/logic/wallets/pairing/hooks/usePairing'
import onboard from 'src/logic/wallets/onboard'

const styles = () => ({
  logo: {
    justifyContent: 'center',
  },
  text: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  connect: {
    textAlign: 'center',
    marginTop: '60px',
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

const StyledCard = styled(Card)`
  padding: 20px;
  max-width: 240px;
`
const ConnectDetails = ({ classes }): ReactElement => {
  usePairing()

  const getUri = () => onboard().getState().wallet.provider?.wc?.uri

  return (
    <StyledCard>
      <Row align="center" margin="lg">
        <Paragraph className={classes.text} noMargin size="xl" weight="bolder">
          Connect a Wallet
        </Paragraph>
      </Row>

      <Row className={classes.logo}>
        <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
      </Row>
      <Block className={classes.connect}>
        <ConnectButton data-testid="heading-connect-btn" />
      </Block>

      <Divider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.text} noMargin size="xl" weight="bolder">
          Connect to Mobile Safe
        </Paragraph>
      </Row>

      {/* @TODO: Fix center and improve loading state */}
      {getUri() ? <QRCode value={getUri()} style={{ justifyContent: 'center' }} /> : 'Loading...'}

      <Row align="center" margin="lg">
        <Paragraph className={classes.text} noMargin size="sm" weight="bolder">
          Scan this code in the{' '}
          <Link href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">Gnosis Safe app</Link> to sign
          transactions with your mobile device.
          <br />
          {/* @TODO: Link */}
          <Link href="#">Learn more</Link> about this feature.
        </Paragraph>
      </Row>

      <Block className={classes.connect}>
        <a href="https://apps.apple.com/us/app/gnosis-safe/id1515759131">
          <img
            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1599436800&h=93244e063e3bdf5b5b9f93aff647da09"
            alt="Download on the App Store"
            style={{ height: 35 }}
          />
        </a>
      </Block>
    </StyledCard>
  )
}

export default withStyles(styles as any)(ConnectDetails)
