import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'
import { Card } from '@gnosis.pm/safe-react-components'

import ConnectButton from 'src/components/ConnectButton'

import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'

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
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
})

const ConnectDetails = ({ classes }) => (
  <>
    <Card>
      <div>
        <Row align="center" margin="lg">
          <Paragraph className={classes.text} noMargin size="xl" weight="bolder">
            Connect a Wallet
          </Paragraph>
        </Row>
      </div>
      <Row className={classes.logo} margin="lg">
        <KeyRing center circleSize={75} dotRight={25} dotSize={25} dotTop={50} keySize={32} mode="error" />
      </Row>
      <Block className={classes.connect}>
        <ConnectButton data-testid="heading-connect-btn" />
      </Block>
    </Card>
  </>
)

export default withStyles(styles as any)(ConnectDetails)
