import React, { useContext, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { useSelector } from 'react-redux'
import { useRouteMatch, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'

import SidebarLayout from 'src/components/SidebarLayout'
import Header from 'src/components/SidebarLayout/Header'
import Sidebar from 'src/components/SidebarLayout/Sidebar'
import SafeListSidebarProvider, { SafeListSidebarContext } from 'src/components/SafeListSidebar'
import CookiesBanner from 'src/components/CookiesBanner'
import Notifier from 'src/components/Notifier'
import Backdrop from 'src/components/layout/Backdrop'
import Img from 'src/components/layout/Img'
import { getNetwork } from 'src/config'
import { ETHEREUM_NETWORK } from 'src/logic/wallets/getWeb3'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS, WELCOME_ADDRESS } from 'src/routes/routes'
import { safeNameSelector, safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
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

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
`

const desiredNetwork = getNetwork()

const useStyles = makeStyles(notificationStyles)

const App: React.FC = ({ children }) => {
  const classes = useStyles()

  const currentNetwork = useSelector(networkSelector)
  const isWrongNetwork = currentNetwork !== ETHEREUM_NETWORK.UNKNOWN && currentNetwork !== desiredNetwork
  const { toggleSidebar } = useContext(SafeListSidebarContext)

  const matchSafe = useRouteMatch({ path: `${SAFELIST_ADDRESS}`, strict: false })

  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
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

  useEffect(() => {
    if (matchSafe?.isExact) {
      history.push(WELCOME_ADDRESS)
      return
    }
  }, [matchSafe, history])

  const sidebarItems = useMemo((): ListItemType[] => {
    if (!matchSafeWithAddress) {
      return []
    }

    return [
      {
        label: 'ASSETS',
        icon: <ListIcon type="assets" />,
        selected: matchSafeWithAction?.params.safeAction === 'balances',
        href: `${matchSafeWithAddress.url}/balances`,
      },
      {
        label: 'TRANSACTIONS',
        icon: <ListIcon type="transactionsInactive" />,
        selected: matchSafeWithAction?.params.safeAction === 'transactions',
        href: `${matchSafeWithAddress.url}/transactions`,
      },
      {
        label: 'AddressBook',
        icon: <ListIcon type="addressBook" />,
        selected: matchSafeWithAction?.params.safeAction === 'address-book',
        href: `${matchSafeWithAddress.url}/address-book`,
      },
      {
        label: 'Apps',
        icon: <ListIcon type="apps" />,
        selected: matchSafeWithAction?.params.safeAction === 'apps',
        href: `${matchSafeWithAddress.url}/apps`,
      },
      {
        label: 'Settings',
        icon: <ListIcon type="settings" />,
        selected: matchSafeWithAction?.params.safeAction === 'settings',
        href: `${matchSafeWithAddress.url}/settings`,
      },
    ]
  }, [matchSafeWithAction, matchSafeWithAddress])

  const onReceiveShow = () => onShow('Receive')
  const onReceiveHide = () => onHide('Receive')

  return (
    <Frame>
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
                items={matchSafe !== null ? sidebarItems : []}
                safeAddress={safeAddress}
                safeName={safeName}
                balance={balance}
                granted={granted}
                onToggleSafeList={toggleSidebar}
                onReceiveClick={onReceiveShow}
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
            handleClose={onReceiveHide}
            open={safeActionsState.showReceive as boolean}
            title="Receive Tokens"
          >
            <Receive onClose={onReceiveHide} />
          </Modal>
        </>
      </SnackbarProvider>
      <CookiesBanner />
    </Frame>
  )
}

const WrapperAppWithSidebar: React.FC = ({ children }) => (
  <SafeListSidebarProvider>
    <App>{children}</App>
  </SafeListSidebarProvider>
)

export default WrapperAppWithSidebar
