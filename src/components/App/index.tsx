import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { connect } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'

import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'
import styles from './index.module.scss'

import SidebarLayout from 'src/components/SidebarLayout'
import Header from 'src/components/SidebarLayout/Header'
import Sidebar from 'src/components/SidebarLayout/Sidebar'
import { SidebarContext } from 'src/components/Sidebar'
import CookiesBanner from 'src/components/CookiesBanner'
import Notifier from 'src/components/Notifier'
import SidebarProvider from 'src/components/Sidebar'
import Backdrop from 'src/components/layout/Backdrop'
import Img from 'src/components/layout/Img'
import { getNetwork } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { AppReduxState } from 'src/store'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

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

const App = ({ children, classes, currentNetwork }) => {
  const isWrongNetwork = currentNetwork !== ETHEREUM_NETWORK.UNKNOWN && currentNetwork !== desiredNetwork
  const match = useRouteMatch({ path: SAFELIST_ADDRESS, strict: true })
  const { toggleSidebar } = useContext(SidebarContext)

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

          <SidebarLayout
            topbar={<Header />}
            sidebar={match ? <Sidebar onToggleSafeList={toggleSidebar} /> : null}
            body={children}
          />
        </>
      </SnackbarProvider>
      <CookiesBanner />
    </div>
  )
}

const WrapperApp = withStyles(notificationStyles)(
  connect(
    (state: AppReduxState) => ({
      currentNetwork: networkSelector(state),
    }),
    null,
  )(App),
)

const WrapperAppWithSidebar: React.FC = ({ children }) => (
  <SidebarProvider>
    <WrapperApp>{children}</WrapperApp>
  </SidebarProvider>
)

export default WrapperAppWithSidebar
