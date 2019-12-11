// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Img from '~/components/layout/Img'
import { OUTGOING_TX_TYPE, type TransactionStatus } from '~/routes/safe/store/models/transaction'
import { INCOMING_TX_TYPE } from '~/routes/safe/store/models/incomingTransaction'
import CustomIcon from './assets/custom.svg'
import ReceivedIcon from './assets/received.svg'
import SentIcon from './assets/sent.svg'
import SettingsChangeIcon from './assets/settings-change.svg'
import { styles } from './style'

type Props = {
  status: TransactionStatus,
  label: string,
}

const statusToIcon = {
  [INCOMING_TX_TYPE]: ReceivedIcon,
  [OUTGOING_TX_TYPE]: SentIcon,
  custom: CustomIcon,
  settingsChange: SettingsChangeIcon,
}

const typeStatusIconStyle = {
  height: '10px',
  width: '10px',
  marginRight: '8px',
}

const TypeStatus = ({ status, label }: Props) => {
  const Icon = statusToIcon[status]

  return (
    <Block>
      <Img src={Icon} alt={`${status} icon`} style={typeStatusIconStyle} />
      {label}
    </Block>
  )
}

export default withStyles(styles)(TypeStatus)
