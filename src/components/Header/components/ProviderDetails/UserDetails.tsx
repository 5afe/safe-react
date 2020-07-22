import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import classNames from 'classnames'
import * as React from 'react'

import CopyBtn from 'src/components/CopyBtn'
import EtherscanBtn from 'src/components/EtherscanBtn'
import CircleDot from 'src/components/Header/components/CircleDot'
import Identicon from 'src/components/Identicon'
import Spacer from 'src/components/Spacer'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import { background, connected as connectedBg, lg, md, sm, warning, xs } from 'src/theme/variables'
import { upperFirst } from 'src/utils/css'

const dot = require('../../assets/dotRinkeby.svg')
const walletIcon = require('../../assets/wallet.svg')

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

const UserDetails = ({ classes, connected, network, onDisconnect, openDashboard, provider, userAddress }) => {
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
        <Button
          color="primary"
          fullWidth
          onClick={onDisconnect}
          size="medium"
          variant="contained"
          data-testid="disconnect-btn"
        >
          <Paragraph className={classes.disconnectText} color="white" noMargin size="md">
            Disconnect
          </Paragraph>
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles as any)(UserDetails)
