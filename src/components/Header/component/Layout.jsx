// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import OpenInNew from '@material-ui/icons/OpenInNew'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Row from '~/components/layout/Row'
import Identicon from '~/components/Identicon'
import Spacer from '~/components/Spacer'
import Connected from './Connected'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = {
  provider: string,
  classes: Object,
}

const styles = theme => ({
  root: {
    width: '100%',
  },
  logo: {
    flexBasis: '125px',
  },
  provider: {
    flexBasis: '130px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  user: {
    alignItems: 'center',
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
    width: '350px',
    border: '1px solid grey',
    display: 'block',
    padding: '12px 4px 4px',
    marginLeft: 'auto',
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

const Header = ({ provider, classes }: Props) => {
  const providerText = provider ? `${provider} [Rinkeby]` : 'Not connected'

  return (
    <React.Fragment>
      <ExpansionPanel className={classes.root} elevation={0} defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Row grow>
            <Col start="xs" middle="xs" className={classes.logo}>
              <Img src={logo} height={54} alt="Gnosis Safe" />
            </Col>
            <Spacer />
            <Col end="sm" middle="xs" layout="column" className={classes.provider}>
              <Paragraph size="sm" transform="capitalize" noMargin bold>{providerText}</Paragraph>
              <Paragraph size="sm" noMargin>0x873faa....d30aaa</Paragraph>
            </Col>
          </Row>
        </ExpansionPanelSummary>
        { provider &&
          <React.Fragment>
            <ExpansionPanelDetails className={classes.details}>
              <Row grow margin="md">
                <Connected provider={provider} />
                <Spacer />
              </Row>
              <Row className={classes.user} margin="md" grow >
                <Identicon address="0x873faa4cddd5b157e8e5a57e7a5479afc5d30f0b" diameter={25} />
                <Paragraph className={classes.address} size="sm" noMargin>0x873faa4cddd5b157e8e5a57e7a5479afc5d30f0b</Paragraph>
                <OpenInNew style={{ height: '14px' }} />
              </Row>
              <Col align="center" margin="md" grow>
                <Button size="small" variant="raised" color="secondary">DISCONNECT</Button>
              </Col>
            </ExpansionPanelDetails>
          </React.Fragment>
        }
      </ExpansionPanel>
    </React.Fragment>
  )
}

export default withStyles(styles)(Header)
