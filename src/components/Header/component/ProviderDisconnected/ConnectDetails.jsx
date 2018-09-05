// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import { md } from '~/theme/variables'

const connectedLogo = require('../../assets/connect-wallet.svg')

type Props = {
  classes: Object,
}

const styles = () => ({
  container: {
    padding: `${md} 12px`,
  },
  logo: {
    justifyContent: 'center',
  },
  text: {
    letterSpacing: '-0.6px',
    flexGrow: 1,
    textAlign: 'center',
  },
  connect: {
    padding: `${md} 32px`,
  },
  img: {
    margin: '0px 2px',
  },
})

const ConnectDetails = ({ classes }: Props) => (
  <React.Fragment>
    <div className={classes.container}>
      <Row margin="lg" align="center">
        <Paragraph className={classes.text} size="lg" noMargin weight="bolder">Connect a Wallet</Paragraph>
      </Row>
    </div>
    <Row className={classes.logo} margin="lg">
      <Img className={classes.img} src={connectedLogo} height={75} alt="Connect a Wallet" />
    </Row>
    <Row className={classes.connect}>
      <Button
        size="medium"
        variant="raised"
        color="primary"
        fullWidth
      >
        CONNECT
      </Button>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(ConnectDetails)
