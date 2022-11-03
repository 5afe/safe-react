import { useContext } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import AppLayout from 'src/components/AppLayout'
import { SafeListSidebar, SafeListSidebarContext } from 'src/components/SafeListSidebar'
import CookiesBanner from 'src/components/CookiesBanner'
import { currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import Modal from 'src/components/Modal'
import SendModal from 'src/routes/safe/components/Balances/SendModal'
import useSafeActions from 'src/logic/safe/hooks/useSafeActions'
import { formatCurrency } from 'src/logic/tokens/utils/formatAmount'
import { grantedSelector } from 'src/routes/safe/container/selector'
import ReceiveModal from './ReceiveModal'
import { useSidebarItems } from 'src/components/AppLayout/Sidebar/useSidebarItems'
import useAddressBookSync from 'src/logic/addressBook/hooks/useAddressBookSync'
import { useCurrentSafeAddressSync } from 'src/logic/currentSession/hooks/useCurrentSafeAddressSync'
import PsaBanner from '../PsaBanner'

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  max-width: 100%;
`

const App: React.FC = ({ children }) => {
  const { toggleSidebar } = useContext(SafeListSidebarContext)
  const { name: safeName, totalFiatBalance: currentSafeBalance } = useSelector(currentSafeWithNames)
  const { safeActionsState, onShow, onHide, showSendFunds, hideSendFunds } = useSafeActions()
  const currentCurrency = useSelector(currentCurrencySelector)
  const granted = useSelector(grantedSelector)
  const sidebarItems = useSidebarItems()
  const { address: safeAddress } = useSelector(currentSafeWithNames)

  useCurrentSafeAddressSync()
  useAddressBookSync()

  const sendFunds = safeActionsState.sendFunds
  const balance = formatCurrency(currentSafeBalance.toString(), currentCurrency)

  const onReceiveShow = () => onShow('Receive')
  const onReceiveHide = () => onHide('Receive')

  return (
    <Frame>
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

      {safeAddress && (
        <Modal
          description="Receive Tokens Form"
          handleClose={onReceiveHide}
          open={safeActionsState.showReceive}
          paperClassName="receive-modal"
          title="Receive Tokens"
        >
          <ReceiveModal onClose={onReceiveHide} safeAddress={safeAddress} safeName={safeName} />
        </Modal>
      )}
      {/* <CookiesBanner /> */}
    </Frame>
  )
}

const WrapperAppWithSidebar: React.FC = ({ children }) => (
  <SafeListSidebar>
    <App>{children}</App>
  </SafeListSidebar>
)

export default WrapperAppWithSidebar
