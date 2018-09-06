// @flow
import * as React from 'react'
import OpenInNew from '@material-ui/icons/OpenInNew'
import { withStyles } from '@material-ui/core/styles'
import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import Identicon from '~/components/Identicon'
import Bold from '~/components/layout/Bold'
import Hairline from '~/components/layout/Hairline'
import Img from '~/components/layout/Img'
import Row from '~/components/layout/Row'
import Block from '~/components/layout/Block'
import Spacer from '~/components/Spacer'
import { xs, sm, md, lg, background } from '~/theme/variables'
import { upperFirst } from '~/utils/css'
import { shortVersionOf } from '~/logic/wallets/ethAddresses'

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
  color: '#467ee5',
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
})

const UserDetails = ({
  provider, connected, network, userAddress, classes, onDisconnect,
}: Props) => {
  const status = connected ? 'Connected' : 'Connection error'
  const address = userAddress ? shortVersionOf(userAddress, 6) : 'Not available'
  const identiconAddress = userAddress || 'random'
  const connectionLogo = connected ? connectedLogo : connectedWarning
  const color = connected ? 'primary' : 'warning'

  return (
    <React.Fragment>
      <Block className={classes.container}>
        <Row className={classes.identicon} margin="md" align="center">
          <Identicon address={identiconAddress} diameter={60} />
        </Row>
        <Block align="center" className={classes.user}>
          <Paragraph className={classes.address} size="sm" noMargin>{address}</Paragraph>
          <OpenInNew className={classes.open} style={openIconStyle} />
        </Block>
      </Block>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph size="sm" noMargin align="right">Status </Paragraph>
        <Spacer />
        <Img className={classes.logo} src={connectionLogo} height={16} alt="Conection Status" />
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
