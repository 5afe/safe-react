import CircularProgress from '@material-ui/core/CircularProgress'
import React, { ReactElement } from 'react'

import AwaitingIcon from './assets/awaiting.svg'
import ErrorIcon from './assets/error.svg'
import OkIcon from './assets/ok.svg'
import { useStyles } from './style'

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
} as const

const statusToLabel = {
  success: 'Success',
  cancelled: 'Cancelled',
  failed: 'Failed',
  awaiting_your_confirmation: 'Awaiting your confirmation',
  awaiting_confirmations: 'Awaiting confirmations',
  awaiting_execution: 'Awaiting execution',
  pending: 'Pending',
} as const

const statusIconStyle = {
  height: '14px',
  width: '14px',
}

const Status = ({ status }: { status: keyof typeof statusToLabel }): ReactElement => {
  const classes = useStyles()
  const Icon: typeof statusToIcon[keyof typeof statusToIcon] = statusToIcon[status]

  return (
    <Block className={`${classes.container} ${classes[status]}`}>
      {typeof Icon === 'object' ? Icon : <Img alt={statusToLabel[status]} src={Icon} style={statusIconStyle} />}
      <Paragraph className={classes.statusText} noMargin data-testid={`tx-status-${statusToLabel[status]}`}>
        {statusToLabel[status]}
      </Paragraph>
    </Block>
  )
}

export default Status
