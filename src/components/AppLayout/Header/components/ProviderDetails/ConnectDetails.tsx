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
import { Skeleton } from '@material-ui/lab'

const styles = () => ({
  header: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  appStore: {
    height: '35px',
  },
})

const StyledCard = styled(Card)`
  padding: 20px;
  max-width: 240px;
`

const StyledDivider = styled(Divider)`
  width: calc(100% + 40px);
  margin-left: -20px;
`

const ConnectDetails = ({ classes }): ReactElement => {
  usePairing()

  const uri = onboard().getState().wallet.provider?.wc?.uri

  return (
    <StyledCard>
      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin size="xl" weight="bolder">
          Connect a Wallet
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter} margin="lg">
        <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
      </Row>

      <Block className={classes.centerText}>
        <ConnectButton data-testid="heading-connect-btn" />
      </Block>

      <StyledDivider />

      <Row align="center" margin="lg">
        <Paragraph className={classes.header} noMargin size="xl" weight="bolder">
          Connect to Mobile Safe
        </Paragraph>
      </Row>

      <Row className={classes.justifyCenter}>
        {uri ? <QRCode value={uri} size={120} /> : <Skeleton variant="rect" width={120} height={120} />}
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
    </StyledCard>
  )
}

export default withStyles(styles as any)(ConnectDetails)
