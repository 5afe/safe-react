// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Identicon from '~/components/Identicon'
import Dot from '@material-ui/icons/FiberManualRecord'
import Bold from '~/components/layout/Bold'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Spacer from '~/components/Spacer'
import { xs, sm, md, lg, background, secondary, warning } from '~/theme/variables'
import { upperFirst } from '~/utils/css'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'
import { openAddressInEtherScan } from '~/logic/wallets/getWeb3'
import CircleDot from '~/components/Header/component/CircleDot'

const metamask = require('../../assets/metamask.svg')
const connectedLogo = require('../../assets/connected.svg')
const connectedWarning = require('../../assets/connected-error.svg')
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
    letterSpacing: '-0.5px',
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
  warning: {
    marginRight: xs,
    color: warning,
    height: '15px',
    width: '15px',
  },
})

const UserDetails = ({
  provider, connected, network, userAddress, classes, onDisconnect,
}: Props) => {
  const status = connected ? 'Connected' : 'Connection error'
  const address = userAddress ? shortVersionOf(userAddress, 6) : 'Address not available'
  const identiconAddress = userAddress || 'random'
  const connectionLogo = connected ? connectedLogo : connectedWarning
  const color = connected ? 'primary' : 'warning'

  return (
    <React.Fragment>
      <Block className={classes.container}>
        <Row className={classes.identicon} margin="md" align="center">
          { connected
            ? <Identicon address={identiconAddress} diameter={60} />
            : <CircleDot keySize={30} circleSize={75} dotSize={25} dotTop={50} dotRight={25} mode="warning" hideDot />
          }
        </Row>
        <Block align="center" className={classes.user}>
          <Paragraph className={classes.address} size="sm" noMargin>{address}</Paragraph>
          { userAddress &&
            <OpenInNew
              className={classes.open}
              style={openIconStyle}
              onClick={openAddressInEtherScan(userAddress, network)}
            />
          }
        </Block>
      </Block>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph size="sm" noMargin align="right">Status </Paragraph>
        <Spacer />
        { connected
          ? <Img className={classes.logo} src={connectionLogo} height={16} alt="Conection Status" />
          : <Dot className={classes.warning} />
        }
        <Paragraph size="sm" noMargin align="right" color={color}>
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
        <Paragraph size="sm" noMargin align="right">Network </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={dot} height={16} alt="Network" />
        <Paragraph size="sm" noMargin align="right">
          <Bold>{upperFirst(network)}</Bold>
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.disconnect}>
        <Button
          onClick={onDisconnect}
          size="medium"
          variant="raised"
          color="primary"
          fullWidth
        >
          <Paragraph className={classes.disconnectText} size="sm" weight="regular" color="white" noMargin>DISCONNECT</Paragraph>
        </Button>
      </Row>
    </React.Fragment>
  )
}

export default withStyles(styles)(UserDetails)
