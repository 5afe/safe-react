import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import AwaitingIcon from './assets/awaiting.svg'
import ErrorIcon from './assets/error.svg'
import OkIcon from './assets/ok.svg'
import { styles } from './style'

import Block from 'src/components/layout/Block'
import Img from 'src/components/layout/Img'
import Paragraph from 'src/components/layout/Paragraph/'

const statusToIcon = {
  success: OkIcon,
  cancelled: ErrorIcon,
  failed: ErrorIcon,
  awaiting_your_confirmation: AwaitingIcon,
  awaiting_confirmations: AwaitingIcon,
  awaiting_execution: AwaitingIcon,
  pending: <CircularProgress size={14} />,
}

const statusToLabel = {
  success: 'Success',
  cancelled: 'Cancelled',
  failed: 'Failed',
  awaiting_your_confirmation: 'Awaiting your confirmation',
  awaiting_confirmations: 'Awaiting confirmations',
  awaiting_execution: 'Awaiting execution',
  pending: 'Pending',
}

const statusIconStyle = {
  height: '14px',
  width: '14px',
}

const Status = ({ classes, status }) => {
  const Icon = statusToIcon[status]

  return (
    <Block className={`${classes.container} ${classes[status]}`}>
      {typeof Icon === 'object' ? Icon : <Img alt={statusToLabel[status]} src={Icon} style={statusIconStyle} />}
      <Paragraph className={classes.statusText} noMargin data-testid={`tx-status-${statusToLabel[status]}`}>
        {statusToLabel[status]}
      </Paragraph>
    </Block>
  )
}

export default withStyles(styles as any)(Status)
