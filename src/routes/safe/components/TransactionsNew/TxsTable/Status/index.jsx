// @flow
import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Block from '~/components/layout/Block'
import Paragraph from '~/components/layout/Paragraph/'
import Img from '~/components/layout/Img'
import ErrorIcon from './assets/error.svg'
import OkIcon from './assets/ok.svg'
import AwaitingIcon from './assets/awaiting.svg'
import { styles } from './style'

type Props = {
  classes: Object,
  status: 'pending' | 'awaiting' | 'success' | 'failed',
}

const statusToIcon = {
  success: OkIcon,
  failed: ErrorIcon,
  awaiting: AwaitingIcon,
}

const statusIconStyle = {
  height: '14px',
  width: '14px',
}

const Status = ({ classes, status }: Props) => (
  <Block className={`${classes.container} ${classes[status]}`}>
    <Img src={statusToIcon[status]} alt="OK Icon" style={statusIconStyle} />
    <Paragraph noMargin className={classes.statusText}>{status}</Paragraph>
  </Block>
)

export default withStyles(styles)(Status)
