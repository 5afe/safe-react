import { withStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'
import { connect } from 'react-redux'

import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'
import styles from './index.module.scss'

import CookiesBanner from 'src/components/CookiesBanner'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import Notifier from 'src/components/Notifier'
import SidebarProvider from 'src/components/Sidebar'
import Backdrop from 'src/components/layout/Backdrop'
import Img from 'src/components/layout/Img'
import { getNetwork } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { networkSelector } from 'src/logic/wallets/store/selectors'

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

const desiredNetwork = getNetwork()

const PageFrame = ({ children, classes, currentNetwork }) => {
  const isWrongNetwork = currentNetwork !== ETHEREUM_NETWORK.UNKNOWN && currentNetwork !== desiredNetwork

  return (
    <div className={styles.frame}>
      <Backdrop isOpen={isWrongNetwork} />
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
          <Notifier />
          <SidebarProvider>
            <Header />
            {children}
            <Footer />
          </SidebarProvider>
        </>
      </SnackbarProvider>
      <CookiesBanner />
    </div>
  )
}

export default withStyles(notificationStyles)(
  connect(
    (state) => ({
      currentNetwork: networkSelector(state),
    }),
    null,
  )(PageFrame),
)
