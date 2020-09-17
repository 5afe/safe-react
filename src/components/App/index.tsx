import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { useSelector } from 'react-redux'
import { useRouteMatch, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import AlertIcon from './assets/alert.svg'
import CheckIcon from './assets/check.svg'
import ErrorIcon from './assets/error.svg'
import InfoIcon from './assets/info.svg'

import AppLayout from 'src/components/AppLayout'
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

import Receive from './ReceiveModal'
import { useSidebarItems } from 'src/components/AppLayout/Sidebar/useSidebarItems'

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
  const history = useHistory()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()
  const currentSafeBalance = useSelector(safeFiatBalancesTotalSelector)
  const currentCurrency = useSelector(currentCurrencySelector)
  const granted = useSelector(grantedSelector)
  const sidebarItems = useSidebarItems()

  useLoadSafe(safeAddress)
  useSafeScheduledUpdates(safeAddress)

  const sendFunds = safeActionsState.sendFunds as { isOpen: boolean; selectedToken: string }
  const formattedTotalBalance = currentSafeBalance ? formatAmountInUsFormat(currentSafeBalance) : ''
  const balance =
    !!formattedTotalBalance && !!currentCurrency ? `${formattedTotalBalance} ${currentCurrency}` : undefined

  useEffect(() => {
    if (matchSafe?.isExact) {
      history.push(WELCOME_ADDRESS)
      return
    }
  }, [matchSafe, history])

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

          <AppLayout
            sidebarItems={sidebarItems}
            safeAddress={safeAddress}
            safeName={safeName}
            balance={balance}
            granted={granted}
            onToggleSafeList={toggleSidebar}
            onReceiveClick={onReceiveShow}
            onNewTransactionClick={() => showSendFunds('')}
          >
            {children}
          </AppLayout>

          <SendModal
            activeScreenType="chooseTxType"
            isOpen={sendFunds.isOpen}
            onClose={hideSendFunds}
            selectedToken={sendFunds.selectedToken}
          />

          {safeAddress && safeName && (
            <Modal
              description="Receive Tokens Form"
              handleClose={onReceiveHide}
              open={safeActionsState.showReceive as boolean}
              title="Receive Tokens"
            >
              <Receive onClose={onReceiveHide} safeAddress={safeAddress} safeName={safeName} />
            </Modal>
          )}
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
