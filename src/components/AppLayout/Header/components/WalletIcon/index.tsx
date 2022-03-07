import { makeStyles } from '@material-ui/core/styles'
import * as React from 'react'

import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import { useOnboard } from 'src/logic/wallets/onboard/useOnboard'
import WALLET_ICONS from './icons'

const useStyles = makeStyles({
  container: {
    marginLeft: '5px',
    marginRight: '10px',
    letterSpacing: '-0.5px',
    flex: 'none',
  },
  icon: {
    maxWidth: 'none',
  },
})

interface WalletIconProps {
  provider: string
}

const WalletIcon = ({ provider }: WalletIconProps): React.ReactElement => {
  const classes = useStyles()
  const { wallet } = useOnboard()
  const walletIcon = WALLET_ICONS[wallet.label]

  return (
    <Col className={classes.container} start="sm">
      {walletIcon && <Img alt={provider} className={classes.icon} {...walletIcon} />}
    </Col>
  )
}

export default WalletIcon
