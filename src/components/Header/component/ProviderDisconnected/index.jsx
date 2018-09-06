// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import { type Open } from '~/components/hoc/OpenHoc'
import { md } from '~/theme/variables'

const connectWallet = require('../../assets/connect-wallet.svg')

type Props = Open & {
  classes: Object,
  children: Function,
}

const styles = () => ({
  network: {
    fontFamily: 'Montserrat, sans-serif',
  },
  account: {
    padding: `0 ${md}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  connect: {
    letterSpacing: '-0.5px',
  },
})

const ProviderDesconnected = ({ classes }: Props) => (
  <React.Fragment>
    <Img src={connectWallet} height={35} alt="Status connected" />
    <Col end="sm" middle="xs" layout="column" className={classes.account}>
      <Paragraph size="sm" transform="capitalize" className={classes.network} noMargin weight="bold">Not Connected</Paragraph>
      <Paragraph size="sm" color="fancy" className={classes.connect} noMargin>Connect Wallet</Paragraph>
    </Col>
  </React.Fragment>
)

export default withStyles(styles)(ProviderDesconnected)
