// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import List from '@material-ui/core/List'
import Identicon from '~/components/Identicon'
import Bold from '~/components/layout/Bold'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import { sm, md, lg, background } from '~/theme/variables'
import { upperFirst } from '~/utils/css'

const metamask = require('../../assets/metamask.svg')
const connectedLogo = require('../../assets/connected.svg')
const dot = require('../../assets/dotRinkeby.svg')

type Props = {
  provider: string,
  connected: boolean,
  network: string,
  userAddress: string,
  classes: Object,
}

const openIconStyle = {
  height: '16px',
  color: '#467ee5',
}

const styles = () => ({
  root: {
    backgroundColor: 'white',
    padding: 0,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
  },
  container: {
    padding: `${md} 12px`,
  },
  identicon: {
    justifyContent: 'center',
    padding: `0 ${md}`,
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

const UserDetails = ({
  provider, connected, network, userAddress, classes,
}: Props) => {
  const status = connected ? 'Connected' : 'Not connected'

  return (
    <List className={classes.root} component="div">
      <div className={classes.container}>
        <Row className={classes.identicon} margin="md" align="center">
          <Identicon address={userAddress} diameter={60} />
        </Row>
        <Row className={classes.user} grow >
          <Paragraph className={classes.address} size="sm" noMargin>{userAddress}</Paragraph>
          <OpenInNew style={openIconStyle} />
        </Row>
      </div>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph size="sm" noMargin align="right">Status </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={connectedLogo} height={16} alt="Status connected" />
        <Paragraph size="sm" noMargin align="right">
          <Bold>
            {status}
          </Bold>
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph size="sm" noMargin align="right">Client </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={metamask} height={16} alt="Metamask client" />
        <Paragraph size="sm" noMargin align="right">
          <Bold>
            {upperFirst(provider)}
          </Bold>
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph size="sm" noMargin align="right">Netowrk </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={dot} height={16} alt="Network" />
        <Paragraph size="sm" noMargin align="right">
          <Bold>{upperFirst(network)}</Bold>
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.disconnect}>
        <Button
          size="medium"
          variant="raised"
          color="primary"
          fullWidth
        >
          DISCONNECT
        </Button>
      </Row>
    </List>
  )
}

export default withStyles(styles)(UserDetails)
