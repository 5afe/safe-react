import React, { useContext } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { connect, useSelector } from 'react-redux'
import { useRouteMatch, useHistory } from 'react-router-dom'

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
import { safeNameSelector, safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import Modal from 'src/components/Modal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { useLoadSafe } from 'src/logic/safe/hooks/useLoadSafe'
import { useSafeScheduledUpdates } from 'src/logic/safe/hooks/useSafeScheduledUpdates'
import useSafeActions from 'src/logic/safe/hooks/useSafeActions'
import { currentCurrencySelector, safeFiatBalancesTotalSelector } from 'src/logic/currencyValues/store/selectors/index'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { grantedSelector } from 'src/routes/safe/container/selector'

import Receive from './ModalReceive'
import { ListItemType } from '../List'
import ListIcon from '../List/ListIcon'

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
  const { toggleSidebar } = useContext(SidebarContext)

  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })

  const matchSafeWithAddress = useRouteMatch({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const matchSafeWithAction = useRouteMatch({ path: `${SAFELIST_ADDRESS}/:safeAddress/:safeAction` }) as {
    url: string
    params: Record<string, string>
  }
  const history = useHistory()

  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()
  const currentSafeBalance = useSelector(safeFiatBalancesTotalSelector)
  const currentCurrency = useSelector(currentCurrencySelector)
  const granted = useSelector(grantedSelector)

  useLoadSafe(safeAddress)
  useSafeScheduledUpdates(safeAddress)

  const sendFunds = safeActionsState.sendFunds as { isOpen: boolean; selectedToken: string }
  const formattedTotalBalance = currentSafeBalance ? formatAmountInUsFormat(currentSafeBalance) : ''

  const balance = !!formattedTotalBalance && !!currentCurrency ? `${formattedTotalBalance} ${currentCurrency}` : null

  const getSidebarItems = (): ListItemType[] => {
    if (!matchSafe) {
      return []
    }

    return [
      {
        label: 'ASSETS',
        icon: <ListIcon type="assets" />,
        selected: matchSafeWithAction.params.safeAction === 'balances',
        onItemClick: () => history.push(`${matchSafeWithAddress.url}/balances`),
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: matchSafeWithAction.params.safeAction === 'transactions',
        onItemClick: () => history.push(`${matchSafeWithAddress.url}/transactions`),
      },
      {
        label: 'AddressBook',
        icon: <ListIcon type="addressBook" />,
        selected: matchSafeWithAction.params.safeAction === 'address-book',
        onItemClick: () => history.push(`${matchSafeWithAddress.url}/address-book`),
      },
      {
        label: 'Apps',
        icon: <ListIcon type="apps" />,
        selected: matchSafeWithAction.params.safeAction === 'apps',
        onItemClick: () => history.push(`${matchSafeWithAddress.url}/apps`),
      },
      {
        label: 'Settings',
        icon: <ListIcon type="settings" />,
        selected: matchSafeWithAction.params.safeAction === 'settings',
        onItemClick: () => history.push(`${matchSafeWithAddress.url}/settings`),
      },
    ]
  }

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
            sidebar={
              <Sidebar
                items={getSidebarItems()}
                safeAddress={safeAddress}
                safeName={safeName}
                balance={balance}
                granted={granted}
                onToggleSafeList={toggleSidebar}
                onReceiveClick={onShow('Receive')}
                onNewTransactionClick={() => showSendFunds('')}
              />
            }
            body={children}
          />

          <SendModal
            activeScreenType="chooseTxType"
            isOpen={sendFunds.isOpen}
            onClose={hideSendFunds}
            selectedToken={sendFunds.selectedToken}
          />

          <Modal
            description="Receive Tokens Form"
            handleClose={onHide('Receive')}
            open={safeActionsState.showReceive as boolean}
            paperClassName={classes.receiveModal}
            title="Receive Tokens"
          >
            <Receive onClose={onHide('Receive')} />
          </Modal>
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
