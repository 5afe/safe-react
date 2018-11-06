// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Open } from '~/components/hoc/OpenHoc'
import { sm, fancy } from '~/theme/variables'

const connectWallet = require('../../assets/key.svg')

type Props = Open & {
  classes: Object,
  children: Function,
}

const styles = () => ({
  network: {
    fontFamily: 'Montserrat, sans-serif',
  },
  account: {
    paddingRight: sm,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'start',
    flexGrow: 1,
  },
  connect: {
    letterSpacing: '-0.5px',
  },
  logo: {
    height: '15px',
    width: '15px',
    top: '12px',
    position: 'relative',
    right: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    color: fancy,
  },
  key: {
    width: '38px',
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f4f9',
    borderRadius: '20px',
  },
})

const ProviderDesconnected = ({ classes }: Props) => (
  <React.Fragment>
    <Block className={classes.key}>
      <Img src={connectWallet} height={18} alt="Status disconnected" />
    </Block>
    <Dot className={classes.logo} />
    <Col end="sm" middle="xs" layout="column" className={classes.account}>
      <Paragraph size="sm" transform="capitalize" className={classes.network} noMargin weight="bold">Not Connected</Paragraph>
      <Paragraph size="sm" color="fancy" className={classes.connect} noMargin>Connect Wallet</Paragraph>
    </Col>
  </React.Fragment>
)

export default withStyles(styles)(ProviderDesconnected)
