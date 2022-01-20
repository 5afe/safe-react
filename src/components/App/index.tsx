import { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import AlertIcon from 'src/assets/icons/alert.svg'
import CheckIcon from 'src/assets/icons/check.svg'
import ErrorIcon from 'src/assets/icons/error.svg'
import InfoIcon from 'src/assets/icons/info.svg'
import AppLayout from 'src/components/AppLayout'
import { SafeListSidebar, SafeListSidebarContext } from 'src/components/SafeListSidebar'
import CookiesBanner from 'src/components/CookiesBanner'
import Notifier from 'src/components/Notifier'
import Img from 'src/components/layout/Img'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import Modal from 'src/components/Modal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import { useLoadSafe } from 'src/logic/safe/hooks/useLoadSafe'
import { useSafeScheduledUpdates } from 'src/logic/safe/hooks/useSafeScheduledUpdates'
import useSafeActions from 'src/logic/safe/hooks/useSafeActions'
import { formatAmountInUsFormat } from 'src/logic/tokens/utils/formatAmount'
import { grantedSelector } from 'src/routes/safe/container/selector'
import ReceiveModal from './ReceiveModal'
import { useSidebarItems } from 'src/components/AppLayout/Sidebar/useSidebarItems'
import useAddressBookSync from 'src/logic/addressBook/hooks/useAddressBookSync'
import { extractSafeAddress } from 'src/routes/routes'

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

const useStyles = makeStyles(notificationStyles)

const App: React.FC = ({ children }) => {
  const classes = useStyles()
  const { toggleSidebar } = useContext(SafeListSidebarContext)
  const { name: safeName, totalFiatBalance: currentSafeBalance } = useSelector(currentSafeWithNames)
  const addressFromUrl = extractSafeAddress()
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()
  const currentCurrency = useSelector(currentCurrencySelector)
  const granted = useSelector(grantedSelector)
  const sidebarItems = useSidebarItems()
  useLoadSafe(addressFromUrl) // load initially
  useSafeScheduledUpdates(addressFromUrl) // load every X seconds
  useAddressBookSync()

  const sendFunds = safeActionsState.sendFunds
  const formattedTotalBalance = currentSafeBalance ? formatAmountInUsFormat(currentSafeBalance.toString()) : ''
  const balance =
    !!formattedTotalBalance && !!currentCurrency ? `${formattedTotalBalance} ${currentCurrency}` : undefined

  const onReceiveShow = () => onShow('Receive')
  const onReceiveHide = () => onHide('Receive')

  return (
    <Frame>
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
            safeAddress={addressFromUrl}
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

          {addressFromUrl && (
            <Modal
              description="Receive Tokens Form"
              handleClose={onReceiveHide}
              open={safeActionsState.showReceive}
              paperClassName="receive-modal"
              title="Receive Tokens"
            >
              <ReceiveModal onClose={onReceiveHide} safeAddress={addressFromUrl} safeName={safeName} />
            </Modal>
          )}
        </>
      </SnackbarProvider>
      <CookiesBanner />
    </Frame>
  )
}

const WrapperAppWithSidebar: React.FC = ({ children }) => (
  <SafeListSidebar>
    <App>{children}</App>
  </SafeListSidebar>
)

export default WrapperAppWithSidebar
