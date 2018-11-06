// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Dot from '@material-ui/icons/FiberManualRecord'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import { md, lg, fancy } from '~/theme/variables'

const connectedLogo = require('../../assets/key.svg')

type Props = {
  classes: Object,
  onConnect: Function,
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
    padding: `${md} ${lg}`,
  },
  connectText: {
    letterSpacing: '1px',
  },
  img: {
    margin: '0px 2px',
  },
  status: {
    height: '25px',
    width: '25px',
    borderRadius: '20px',
    bottom: '93px',
    position: 'absolute',
    right: '98px',
    backgroundColor: '#ffffff',
    color: fancy,
  },
  key: {
    width: '75px',
    height: '75px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e4e8f1',
    borderRadius: '40px',
  },
})

const ConnectDetails = ({ classes, onConnect }: Props) => (
  <React.Fragment>
    <div className={classes.container}>
      <Row margin="lg" align="center">
        <Paragraph className={classes.text} size="lg" noMargin weight="bolder">Connect a Wallet</Paragraph>
      </Row>
    </div>
    <Row className={classes.logo} margin="lg">
      <Block className={classes.key}>
        <Img src={connectedLogo} height={32} alt="Status disconnected" />
      </Block>
      <Dot className={classes.status} />
    </Row>
    <Row className={classes.connect}>
      <Button
        onClick={onConnect}
        size="medium"
        variant="raised"
        color="primary"
        fullWidth
      >
        <Paragraph className={classes.connectText} size="sm" weight="regular" color="white" noMargin>CONNECT</Paragraph>
      </Button>
    </Row>
  </React.Fragment>
)

export default withStyles(styles)(ConnectDetails)
