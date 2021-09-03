import * as React from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { EthHashInfo, Identicon, Card } from '@gnosis.pm/safe-react-components'
import { createStyles } from '@material-ui/core'

import Spacer from 'src/components/Spacer'
import Block from 'src/components/layout/Block'
import Button from 'src/components/layout/Button'
import Hairline from 'src/components/layout/Hairline'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { background, connected as connectedBg, lg, md, sm, warning, xs } from 'src/theme/variables'
import { getExplorerInfo } from 'src/config'
import { KeyRing } from 'src/components/AppLayout/Header/components/KeyRing'
import WalletIcon from '../../assets/wallet.svg'
import { useSelector } from 'react-redux'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { shouldSwitchNetwork } from 'src/logic/wallets/utils/network'
import { currentChainId } from 'src/logic/config/store/selectors'
import ChainIndicator from 'src/components/ChainIndicator'

const styles = createStyles({
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
  capitalize: {
    textTransform: 'capitalize',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  buttonRow: {
    padding: `${md} ${lg} 0`,
  },
  disconnectButton: {
    marginBottom: `${md}`,
    '&:hover': {
      backgroundColor: '#F02525',
      color: '#fff',
    },
  },
  dashboard: {
    padding: `${md} ${lg} ${xs}`,
  },
  dashboardText: {
    letterSpacing: '1px',
  },
  logo: {
    margin: `0px ${xs}`,
  },
  warning: {
    color: warning,
  },
  connected: {
    color: connectedBg,
  },
})

const StyledCard = styled(Card)`
  padding: 0px;
`
type Props = {
  connected: boolean
  onDisconnect: () => void
  onNetworkChange?: () => unknown
  openDashboard?: (() => void | null) | boolean
  provider?: string
  userAddress: string
}

const useStyles = makeStyles(styles)

export const UserDetails = ({
  connected,
  onDisconnect,
  onNetworkChange,
  openDashboard,
  provider,
  userAddress,
}: Props): React.ReactElement => {
  const explorerUrl = getExplorerInfo(userAddress)
  const connectedNetwork = useSelector(networkSelector)
  const desiredNetwork = useSelector(currentChainId)
  const classes = useStyles()

  return (
    <StyledCard>
      <Block className={classes.container}>
        <Row align="center" className={classes.identicon} margin="md">
          {connected ? (
            <Identicon address={userAddress || 'random'} size="xxl" />
          ) : (
            <KeyRing circleSize={75} dotRight={25} dotSize={25} dotTop={50} hideDot keySize={30} mode="warning" />
          )}
        </Row>
        <Block className={classes.user} justify="center">
          {userAddress ? (
            <EthHashInfo hash={userAddress} showCopyBtn explorerUrl={explorerUrl} shortenHash={4} />
          ) : (
            'Address not available'
          )}
        </Block>
      </Block>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph align="right" className={classes.labels} noMargin>
          Wallet
        </Paragraph>
        <Spacer />
        <Img alt="Wallet icon" className={classes.logo} height={14} src={WalletIcon} />
        <Paragraph align="right" className={`${classes.labels} ${classes.capitalize}`} noMargin weight="bolder">
          {provider}
        </Paragraph>
      </Row>
      <Hairline margin="xs" />
      <Row className={classes.details}>
        <Paragraph align="right" className={classes.labels} noMargin>
          Connected network
        </Paragraph>
        <Spacer />
        {connectedNetwork && <ChainIndicator chainId={connectedNetwork} />}
      </Row>
      <Hairline margin="xs" />
      {openDashboard && (
        <Row className={classes.dashboard}>
          <Button color="primary" fullWidth onClick={openDashboard} size="medium" variant="contained">
            <Paragraph className={classes.dashboardText} color="white" noMargin size="md">
              {provider} Wallet
            </Paragraph>
          </Button>
        </Row>
      )}
      {shouldSwitchNetwork() && onNetworkChange && (
        <Row className={classes.buttonRow}>
          <Button fullWidth onClick={onNetworkChange} size="medium" variant="outlined" color="primary">
            <Paragraph noMargin size="lg">
              Switch to <ChainIndicator chainId={desiredNetwork} />
            </Paragraph>
          </Button>
        </Row>
      )}
      <Row className={classes.buttonRow}>
        <Button
          className={classes.disconnectButton}
          color="secondary"
          fullWidth
          onClick={onDisconnect}
          size="medium"
          variant="contained"
          data-testid="disconnect-btn"
        >
          <Paragraph noMargin size="lg">
            Disconnect
          </Paragraph>
        </Button>
      </Row>
    </StyledCard>
  )
}
