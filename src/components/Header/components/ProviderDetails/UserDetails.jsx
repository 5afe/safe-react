// @flow
import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import classNames from 'classnames'
import * as React from 'react'

import CopyBtn from '~/components/CopyBtn'
import EtherscanBtn from '~/components/EtherscanBtn'
import CircleDot from '~/components/Header/components/CircleDot'
import Identicon from '~/components/Identicon'
import Spacer from '~/components/Spacer'
import Block from '~/components/layout/Block'
import Button from '~/components/layout/Button'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { background, connected as connectedBg, lg, md, sm, warning, xs } from '~/theme/variables'
import { upperFirst } from '~/utils/css'

const dot = require('../../assets/dotRinkeby.svg')
const walletIcon = require('../../assets/wallet.svg')

type Props = {
  provider: string,
  connected: boolean,
  network: string,
  userAddress: string,
  classes: Object,
  onDisconnect: Function,
  openDashboard?: Function,
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
    marginRight: sm,
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
    '& button': {
      background: '#f02525',
    },
  },
  dashboard: {
    padding: `${md} ${lg} ${xs}`,
  },
  dashboardText: {
    letterSpacing: '1px',
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

const UserDetails = ({ classes, connected, network, onDisconnect, openDashboard, provider, userAddress }: Props) => {
  const status = connected ? 'Connected' : 'Connection error'
  const address = userAddress ? shortVersionOf(userAddress, 4) : 'Address not available'
  const identiconAddress = userAddress || 'random'
  const color = connected ? 'primary' : 'warning'

  return (
    <>
      <Block className={classes.container}>
        <Row align="center" className={classes.identicon} margin="md">
          {connected ? (
            <Identicon address={identiconAddress} diameter={60} />
          ) : (
            <CircleDot circleSize={75} dotRight={25} dotSize={25} dotTop={50} hideDot keySize={30} mode="warning" />
          )}
        </Row>
        <Block className={classes.user} justify="center">
          <Paragraph className={classes.address} noMargin size="sm">
            {address}
          </Paragraph>
          {userAddress && (
            <>
              <CopyBtn content={userAddress} increaseZindex />
              <EtherscanBtn increaseZindex type="address" value={userAddress} />
            </>
          )}
        </Block>
      </Block>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph align="right" className={classes.labels} noMargin>
          Status
        </Paragraph>
        <Spacer />
        <Dot className={classNames(classes.dot, connected ? classes.connected : classes.warning)} />
        <Paragraph align="right" className={classes.labels} color={color} noMargin weight="bolder">
          {status}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph align="right" className={classes.labels} noMargin>
          Wallet
        </Paragraph>
        <Spacer />
        <Img alt="Wallet icon" className={classes.logo} height={14} src={walletIcon} />
        <Paragraph align="right" className={classes.labels} noMargin weight="bolder">
          {upperFirst(provider)}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph align="right" className={classes.labels} noMargin>
          Network
        </Paragraph>
        <Spacer />
        <Img alt="Network" className={classes.logo} height={14} src={dot} />
        <Paragraph align="right" className={classes.labels} noMargin weight="bolder">
          {upperFirst(network)}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      {openDashboard && (
        <Row className={classes.dashboard}>
          <Button color="primary" fullWidth onClick={openDashboard} size="medium" variant="contained">
            <Paragraph className={classes.dashboardText} color="white" noMargin size="md">
              {upperFirst(provider)} Wallet
            </Paragraph>
          </Button>
        </Row>
      )}
      <Row className={classes.disconnect}>
        <Button color="primary" fullWidth onClick={onDisconnect} size="medium" variant="contained">
          <Paragraph className={classes.disconnectText} color="white" noMargin size="md">
            Disconnect
          </Paragraph>
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(UserDetails)
