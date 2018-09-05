// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import { sm, md, lg, background } from '~/theme/variables'

const connectedLogo = require('../../assets/connect-wallet.svg')

type Props = {
  classes: Object,
}

const styles = () => ({
  container: {
    padding: `${md} 12px`,
  },
  user: {
    alignItems: 'center',
    backgroundColor: background,
    padding: sm,
  },
  details: {
    padding: `0 ${lg}`,
    height: '20px',
    alignItems: 'center',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
  },
  disconnect: {
    padding: `${md} 32px`,
  },
  logo: {
    margin: '0px 2px',
  },
})

const ConnectDetails = ({ classes }: Props) => (
  <React.Fragment>
    <div className={classes.container}>
      <Row margin="md" align="center">
        <Paragraph className={classes.address} size="lg" noMargin bolder>Connect a Wallet</Paragraph>
      </Row>
    </div>
    <Row className={classes.details}>
      <Img className={classes.logo} src={connectedLogo} height={16} alt="Status connected" />
    </Row>
    <Hairline margin="xs" />
    <Row className={classes.disconnect}>
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
