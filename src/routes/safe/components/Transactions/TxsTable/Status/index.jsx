// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph/'
import Img from '~/components/layout/Img'
import { type TransactionStatus } from '~/routes/safe/store/models/transaction'
import ErrorIcon from './assets/error.svg'
import OkIcon from './assets/ok.svg'
import AwaitingIcon from './assets/awaiting.svg'
import { styles } from './style'

type Props = {
  classes: Object,
  status: TransactionStatus,
}

const statusToIcon = {
  success: OkIcon,
  cancelled: ErrorIcon,
  awaiting_your_confirmation: AwaitingIcon,
  awaiting_confirmations: AwaitingIcon,
  awaiting_execution: AwaitingIcon,
  pending: <CircularProgress size={14} />,
}

const statusToLabel = {
  success: 'Success',
  cancelled: 'Failed',
  awaiting_your_confirmation: 'Awaiting your confirmation',
  awaiting_confirmations: 'Awaiting confirmations',
  awaiting_execution: 'Awaiting execution',
  pending: 'Pending',
}

const statusIconStyle = {
  height: '14px',
  width: '14px',
}

const Status = ({ classes, status }: Props) => {
  const Icon = statusToIcon[status]

  return (
    <Block className={`${classes.container} ${classes[status]}`}>
      {typeof Icon === 'object' ? (
        Icon
      ) : (
        <Img src={Icon} alt={statusToLabel[status]} style={statusIconStyle} />
      )}
      <Paragraph noMargin className={classes.statusText}>
        {statusToLabel[status]}
      </Paragraph>
    </Block>
  )
}

export default withStyles(styles)(Status)
