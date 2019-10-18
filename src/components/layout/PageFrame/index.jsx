// @flow
import * as React from 'react'
import { SnackbarProvider } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import SidebarProvider from '~/components/Sidebar'
import Header from '~/components/Header'
import Img from '~/components/layout/Img'
import Notifier from '~/components/Notifier'
import AlertLogo from './assets/alert.svg'
import CheckLogo from './assets/check.svg'
import ErrorLogo from './assets/error.svg'
import styles from './index.scss'

const notificationStyles = {
  success: {
    background: '#ffffff',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: '#001428',
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  error: {
    background: '#ffe6ea',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: '#001428',
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  warning: {
    background: '#fff3e2',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: '#001428',
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  info: {
    background: '#e8673c',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: '#ffffff',
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
}

type Props = {
  children: React.Node,
  classes: Object,
}

const PageFrame = ({ children, classes }: Props) => (
  <div className={styles.frame}>
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
      }}
      iconVariant={{
        success: <Img src={CheckLogo} alt="Success" />,
        error: <Img src={ErrorLogo} alt="Error" />,
        warning: <Img src={AlertLogo} alt="Warning" />,
        info: '',
      }}
    >
      <Notifier />
      <SidebarProvider>
        <Header />
        {children}
      </SidebarProvider>
    </SnackbarProvider>
  </div>
)

export default withStyles(notificationStyles)(PageFrame)
