// @flow
import * as React from 'react'
import classNames from 'classnames'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import Paragraph from '~/components/layout/Paragraph'
import Link from '~/components/layout/Link'
import Button from '~/components/layout/Button'
import Identicon from '~/components/Identicon'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Spacer from '~/components/Spacer'
import {
  xs, sm, md, lg, background, secondary, warning, connected as connectedBg,
} from '~/theme/variables'
import { upperFirst } from '~/utils/css'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { getEtherScanLink } from '~/logic/wallets/getWeb3'
import CircleDot from '~/components/Header/component/CircleDot'

const metamaskIcon = require('../../assets/metamask-icon.svg')
const safeIcon = require('../../assets/gnosis-safe-icon.svg')
const dot = require('../../assets/dotRinkeby.svg')

type Props = {
  provider: string,
  connected: boolean,
  network: string,
  userAddress: string,
  classes: Object,
  onDisconnect: Function,
}

const openIconStyle = {
  height: '16px',
  color: secondary,
}

const styles = () => ({
  container: {
    padding: `${md} 12px`,
    display: 'flex',
    flexDirection: 'column',
  },
  identicon: {
    justifyContent: 'center',
    padding: `0 ${md}`,
  },
  user: {
    borderRadius: '3px',
    backgroundColor: background,
    margin: '0 auto',
    padding: '9px',
    lineHeight: 1,
  },
  details: {
    padding: `0 ${md}`,
    height: '20px',
    alignItems: 'center',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
    letterSpacing: '-0.5px',
    fontSize: '12px',
  },
  labels: {
    fontSize: '12px',
    letterSpacing: '0.5px',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  disconnect: {
    padding: `${md} ${lg}`,
  },
  disconnectText: {
    letterSpacing: '1px',
  },
  logo: {
    margin: `0px ${xs}`,
  },
  dot: {
    marginRight: xs,
    height: '15px',
    width: '15px',
  },
  warning: {
    color: warning,
  },
  connected: {
    color: connectedBg,
  },
})

const UserDetails = ({
  provider, connected, network, userAddress, classes, onDisconnect,
}: Props) => {
  const status = connected ? 'Connected' : 'Connection error'
  const address = userAddress ? shortVersionOf(userAddress, 6) : 'Address not available'
  const identiconAddress = userAddress || 'random'
  const color = connected ? 'primary' : 'warning'

  return (
    <React.Fragment>
      <Block className={classes.container}>
        <Row className={classes.identicon} margin="md" align="center">
          {connected ? (
            <Identicon address={identiconAddress} diameter={60} />
          ) : (
            <CircleDot keySize={30} circleSize={75} dotSize={25} dotTop={50} dotRight={25} mode="warning" hideDot />
          )}
        </Row>
        <Block align="center" className={classes.user}>
          <Paragraph className={classes.address} size="sm" noMargin>
            {address}
          </Paragraph>
          {userAddress && (
            <Link className={classes.open} to={getEtherScanLink(userAddress, network)} target="_blank">
              <OpenInNew style={openIconStyle} />
            </Link>
          )}
        </Block>
      </Block>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph noMargin align="right" className={classes.labels}>
          Status
        </Paragraph>
        <Spacer />
        <Dot className={classNames(classes.dot, connected ? classes.connected : classes.warning)} />
        <Paragraph noMargin align="right" color={color} weight="bolder" className={classes.labels}>
          {status}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph noMargin align="right" className={classes.labels}>
          Client
        </Paragraph>
        <Spacer />
        {provider === 'safe'
          ? <Img className={classes.logo} src={safeIcon} height={14} alt="Safe client" />
          : <Img className={classes.logo} src={metamaskIcon} height={14} alt="Metamask client" />
        }
        <Paragraph noMargin align="right" weight="bolder" className={classes.labels}>
          {upperFirst(provider)}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph noMargin align="right" className={classes.labels}>
          Network
        </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={dot} height={14} alt="Network" />
        <Paragraph noMargin align="right" weight="bolder" className={classes.labels}>
          {upperFirst(network)}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.disconnect}>
        <Button onClick={onDisconnect} size="medium" variant="contained" color="primary" fullWidth>
          <Paragraph className={classes.disconnectText} size="sm" weight="bold" color="white" noMargin>
            DISCONNECT
          </Paragraph>
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default withStyles(styles)(UserDetails)
