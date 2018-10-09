// @flow
import SnackbarContent from '@material-ui/core/SnackbarContent'
import classNames from 'classnames/bind'
import * as React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import WarningIcon from '@material-ui/icons/Warning'
import { type WithStyles } from '~/theme/mui'
import { secondary } from '~/theme/variables'

type Variant = 'success' | 'error' | 'warning' | 'info'

type MessageProps = WithStyles & {
  variant: Variant,
  message: string,
}

type Props = MessageProps & {
  onClose?: () => void,
}

type CloseProps = WithStyles & {
  onClose: () => void,
}

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const styles = theme => ({
  success: {
    backgroundColor: '#ffffff',
  },
  successIcon: {
    color: '#00c4c4',
  },
  warning: {
    backgroundColor: '#fff3e2',
  },
  warningIcon: {
    color: '#ffc05f',
  },
  error: {
    backgroundColor: '#ffe6ea',
  },
  errorIcon: {
    color: '#fd7890',
  },
  info: {
    backgroundColor: '#ffffff',
  },
  infoIcon: {
    color: secondary,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

const Close = ({ classes, onClose }: CloseProps) => (
  <IconButton
    key="close"
    aria-label="Close"
    color="inherit"
    className={classes.close}
    onClick={onClose}
  >
    <CloseIcon className={classes.icon} />
  </IconButton>
)

const Message = ({ classes, message, variant }: MessageProps) => {
  const Icon = variantIcon[variant]

  return (
    <span id="client-snackbar" className={classes.message}>
      <Icon className={classNames(classes.icon, classes.iconVariant, classes[`${variant}Icon`])} />
      {message}
    </span>
  )
}

const GnoSnackbarContent = ({
  variant, classes, message, onClose,
}: Props) => {
  const action = onClose ? [<Close key="close" onClose={onClose} classes={classes} />] : undefined
  const messageComponent = <Message classes={classes} message={message} variant={variant} />

  return (
    <SnackbarContent
      className={classNames(classes[variant])}
      aria-describedby="client-snackbar"
      message={messageComponent}
      action={action}
    />
  )
}

export default withStyles(styles)(GnoSnackbarContent)
