import { lazy, ReactElement } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Card } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'

import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import { isPairingSupported } from 'src/logic/wallets/pairing/utils'
import { wrapInSuspense } from 'src/utils/wrapInSuspense'
const PairingDetails = lazy(() => import('src/components/AppLayout/Header/components/ProviderDetails/PairingDetails'))

const styles = () => ({
  header: {
    letterSpacing: '0.4px',
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '18px',
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

const ConnectDetails = ({ classes }): ReactElement => (
  <StyledCard>
    <Row align="center" margin="lg">
      <Paragraph className={classes.header} noMargin>
        Connect a Wallet
      </Paragraph>
    </Row>

    <Row className={classes.justifyCenter} margin="lg">
      <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
    </Row>

    <Block className={classes.centerText}>
      <ConnectButton data-testid="heading-connect-btn" />
    </Block>

    {isPairingSupported() && wrapInSuspense(<PairingDetails classes={classes} />)}
  </StyledCard>
)

export default withStyles(styles as any)(ConnectDetails)
