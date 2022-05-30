import { ReactNode } from 'react'
import { SnackbarProvider } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'

import Img from 'src/components/layout/Img'
import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import useNotifier from 'src/logic/hooks/useNotifier'
import { fontColor, secondaryText, sm } from 'src/theme/variables'

const useStyles = makeStyles({
  contianerRoot: {
    top: '50px',
  },
  root: {
    width: '340px',
  },
  success: {
    background: '#fff',
  },
  error: {
    background: '#ffe6ea',
  },
  warning: {
    background: '#fff3e2',
  },
  info: {
    background: '#fff',
  },
  snackbar: {
    borderRadius: `${sm}`,
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
    flexWrap: 'nowrap',
    padding: '20px',
    '& *[class^="SnackbarItem-message-"]': {
      color: fontColor,
      padding: '0 10px 0 0',
      alignItems: 'stretch',
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: '160px',
      wordBreak: 'break-word',
      '& > img': {
        marginRight: '13px',
      },
    },
    '& *[class^="SnackbarItem-action-"]': {
      paddingLeft: '0',
      '& > button': {
        color: secondaryText,
      },
    },
  },
})

// Hook must be inside the provider
const Notifier = (): null => {
  useNotifier()
  return null
}

const CustomSnackBarProvider = ({ children }: { children: ReactNode }): React.ReactElement => {
  const classes = useStyles()

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className={classes.snackbar}
      classes={{
        containerRoot: classes.contianerRoot,
        root: classes.root,
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
      iconVariant={{
        error: <Img alt="Error" src={ErrorIcon} />,
        info: <Img alt="Info" src={InfoIcon} />,
        success: <Img alt="Success" src={CheckIcon} />,
        warning: <Img alt="Warning" src={AlertIcon} />,
      }}
      maxSnack={5}
    >
      {children}
      <Notifier />
    </SnackbarProvider>
  )
}

export default CustomSnackBarProvider
