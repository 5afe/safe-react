// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Divider from '@material-ui/core/Divider'
import Paragraph from '~/components/layout/Paragraph'
import Col from '~/components/layout/Col'
import Img from '~/components/layout/Img'
import Button from '~/components/layout/Button'
import Refresh from '~/components/Refresh'
import Row from '~/components/layout/Row'
import Spacer from '~/components/Spacer'
import Connected from './Connected'

const logo = require('../assets/gnosis-safe-logo.svg')

type Props = {
  provider: string,
  reloadWallet: Function,
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

const Header = ({ provider, reloadWallet, classes }: Props) => {
  const providerText = provider ? `${provider} [Rinkeby]` : 'Not connected'

  return (
    <React.Fragment>
      <ExpansionPanel elevation={0}>
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
              <Connected provider={provider} />
              <Refresh callback={reloadWallet} />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small">DISCONNECT</Button>
            </ExpansionPanelActions>
          </React.Fragment>
        }
      </ExpansionPanel>
      <Divider />
    </React.Fragment>
  )
}

export default withStyles(styles)(Header)
