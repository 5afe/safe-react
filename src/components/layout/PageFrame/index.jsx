// @flow
import * as React from 'react'
import { connect } from 'react-redux'
import { SnackbarProvider } from 'notistack'
import { withStyles } from '@material-ui/core/styles'
import { getNetwork } from '~/config'
import { ETHEREUM_NETWORK } from '~/logic/wallets/getWeb3'
import SidebarProvider from '~/components/Sidebar'
import Header from '~/components/Header'
import Backdrop from '~/components/layout/Backdrop'
import Img from '~/components/layout/Img'
import Notifier from '~/components/Notifier'
import { networkSelector } from '~/logic/wallets/store/selectors'
import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'
import CookiesBanner from '~/components/CookiesBanner'
import styles from './index.scss'
import { fontColor } from '~/theme/variables'

const notificationStyles = {
  success: {
    background: '#ffffff',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: fontColor,
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  error: {
    background: '#ffe6ea',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: fontColor,
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  warning: {
    background: '#fff3e2',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: fontColor,
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
  },
  info: {
    background: '#ffffff',
    fontFamily: 'Averta',
    fontSize: '14px',
    lineHeight: 1.43,
    color: fontColor,
    minHeight: '58px',
    boxShadow: '0 0 10px 0 rgba(212, 212, 211, 0.59)',
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
          success: <Img src={CheckIcon} alt="Success" />,
          error: <Img src={ErrorIcon} alt="Error" />,
          warning: <Img src={AlertIcon} alt="Warning" />,
          info: <Img src={InfoIcon} alt="Info" />,
        }}
      >
        <Notifier />
        <SidebarProvider>
          <Header />
          {children}
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
