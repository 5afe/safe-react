// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Identicon from '~/components/Identicon'
import Col from '~/components/layout/Col'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import { md } from '~/theme/variables'
import Details from './Details'

type Props = {
  provider: string,
  connected: boolean,
  network: string,
  userAddress: string,
  classes: Object,
}

const openIconStyle = {
  height: '14px',
}

const styles = () => ({
  root: {
    backgroundColor: 'white',
    padding: md,
  },
  user: {
    alignItems: 'center',
    border: '1px solid grey',
    padding: '10px',
    backgroundColor: '#f1f1f1',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
  },
})

const UserDetails = ({
  provider, connected, network, userAddress, classes,
}: Props) => (
  <div className={classes.root}>
    <Row grow margin="md">
      <Details provider={provider} connected={connected} network={network} />
      <Spacer />
    </Row>
    <Row className={classes.user} margin="md" grow >
      <Identicon address={userAddress} diameter={25} />
      <Paragraph className={classes.address} size="sm" noMargin>{userAddress}</Paragraph>
      <OpenInNew style={openIconStyle} />
    </Row>
    <Col align="center" margin="md">
      <Button size="small" variant="raised" color="secondary">DISCONNECT</Button>
    </Col>
  </div>
)

export default withStyles(styles)(UserDetails)
