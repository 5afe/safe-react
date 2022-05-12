import { ReactNode } from 'react'
import { SnackbarProvider } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'

import Img from 'src/components/layout/Img'
import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import Notifier from 'src/components/Notifier'

type SnackBarProviderProps = {
  children: ReactNode
}

const notificationStyles = {
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
}

const useStyles = makeStyles(notificationStyles)

const CustomSnackBarProvider = ({ children }: SnackBarProviderProps): React.ReactElement => {
  const classes = useStyles()

  return (
    <SnackbarProvider
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      classes={{
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
      <>
        {children}
        <Notifier />
      </>
    </SnackbarProvider>
  )
}

export default CustomSnackBarProvider
