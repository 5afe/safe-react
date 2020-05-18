// 
import { withStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'
import { connect } from 'react-redux'

import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'
import styles from './index.scss'

import CookiesBanner from 'components/CookiesBanner'
import Footer from 'components/Footer'
import Header from 'components/Header'
import Notifier from 'components/Notifier'
import SidebarProvider from 'components/Sidebar'
import Backdrop from 'components/layout/Backdrop'
import Img from 'components/layout/Img'
import { getNetwork } from 'config'
import { ETHEREUM_NETWORK } from 'logic/wallets/getWeb3'
import { networkSelector } from 'logic/wallets/store/selectors'

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
        <Notifier />
        <SidebarProvider>
          <Header />
          {children}
          <Footer />
        </SidebarProvider>
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
