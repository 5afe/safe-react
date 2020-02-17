// @flow
import * as React from 'react'
import { SnackbarProvider } from 'notistack'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Backdrop from '~/components/layout/Backdrop'
import CookiesBanner from '~/components/CookiesBanner'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import Img from '~/components/layout/Img'
import Notifier from '~/components/Notifier'
import SidebarProvider from '~/components/Sidebar'
import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import { getNetwork } from '~/config'
import { networkSelector } from '~/logic/wallets/store/selectors'
import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'
import styles from './index.scss'

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

type Props = {
  children: React.Node,
  classes: Object,
  currentNetwork: string,
}

const desiredNetwork = getNetwork()

const PageFrame = ({ children, classes, currentNetwork }: Props) => {
  const isWrongNetwork = currentNetwork !== ETHEREUM_NETWORK.UNKNOWN && currentNetwork !== desiredNetwork

  return (
    <div className={styles.frame}>
      <Backdrop isOpen={isWrongNetwork} />
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
          error: <Img src={ErrorIcon} alt="Error" />,
          info: <Img src={InfoIcon} alt="Info" />,
          success: <Img src={CheckIcon} alt="Success" />,
          warning: <Img src={AlertIcon} alt="Warning" />,
        }}
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
    state => ({
      currentNetwork: networkSelector(state),
    }),
    null,
  )(PageFrame),
)
