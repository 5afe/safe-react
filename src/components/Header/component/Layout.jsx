// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import OpenInNew from '@material-ui/icons/OpenInNew'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Divider from '~/components/layout/Divider'
import Paragraph from '~/components/layout/Paragraph'
import openHoc, { type Open } from '~/components/hoc/OpenHoc'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Identicon from '~/components/Identicon'
import Spacer from '~/components/Spacer'
import { border, sm, md } from '~/theme/variables'
import Details from './Details'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = Open & {
  provider: string,
  classes: Object,
  network: string,
  userAddress: string,
  connected: boolean,
}

const styles = theme => ({
  summary: {
    border: `solid 2px ${border}`,
    alignItems: 'center',
    height: '52px',
  },
  logo: {
    padding: `${sm} ${md}`,
    flexBasis: '95px',
  },
  provider: {
    padding: `${sm} ${md}`,
    alignItems: 'center',
    flex: '0 1 auto',
    display: 'flex',
    cursor: 'pointer',
  },
  account: {
    padding: `0 ${md} 0 ${sm}`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  expand: {
    width: '20px',
    height: '20px',
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
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
    width: '375px',
    border: '1px solid grey',
    display: 'block',
    padding: '12px 8px 4px',
    margin: '0 0 0 auto',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
})

const openIconStyle = {
  height: '14px',
}

const Header = openHoc(({
  open, toggle, provider, network, connected, classes, userAddress,
}: Props) => {
  const providerText = connected ? `${provider} [${network}]` : 'Not connected'
  const cutAddress = connected ? `${userAddress.substring(0, 8)}...${userAddress.substring(36)}` : ''

  return (
    <React.Fragment>
      <Row onClick={toggle} className={classes.summary}>
        <Col start="xs" middle="xs" className={classes.logo}>
          <Img src={logo} height={32} alt="Gnosis Team Safe" />
        </Col>
        <Divider />
        <Spacer />
        <Divider />
        <Col end="sm" middle="xs" className={classes.provider}>
          { connected && <Identicon address={userAddress} diameter={25} /> }
          <Col end="sm" middle="xs" layout="column" className={classes.account}>
            <Paragraph size="sm" transform="capitalize" noMargin bold>{providerText}</Paragraph>
            <Paragraph size="sm" noMargin>{cutAddress}</Paragraph>
          </Col>
          <IconButton disableRipple className={classes.expand}>
            { open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Col>
      </Row>
      { connected &&
        <React.Fragment>
          <ExpansionPanelDetails className={classes.details}>
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
          </ExpansionPanelDetails>
        </React.Fragment>
      }
    </React.Fragment>
  )
})

export default withStyles(styles)(Header)
