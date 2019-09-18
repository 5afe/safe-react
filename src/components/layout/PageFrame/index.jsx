// @flow
import * as React from 'react'
import { SnackbarProvider } from 'notistack'
import SidebarProvider from '~/components/Sidebar'
import { withStyles } from '@material-ui/core/styles'
import Header from '~/components/Header'
import Img from '~/components/layout/Img'
import AlertLogo from './assets/alert.svg'
import CheckLogo from './assets/check.svg'
import ErrorLogo from './assets/error.svg'
import styles from './index.scss'

const classes = {
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
    color: '#001428',
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
}

type Props = {
  children: React.Node,
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
        success: <img src={CheckLogo} />,
        error: <img src={ErrorLogo} />,
        warning: <img src={AlertLogo} />,
      }}
    ><>
      <SidebarProvider>
        <Header />
        {children}
      </SidebarProvider></>
    </SnackbarProvider>
  </div>
)

export default withStyles(classes)(PageFrame)
