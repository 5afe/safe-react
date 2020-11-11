import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { FixedIcon, Loader, Title, Card } from '@gnosis.pm/safe-react-components'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  INTERFACE_MESSAGES,
  Transaction,
  RequestId,
  LowercaseNetworks,
  SendTransactionParams,
} from '@gnosis.pm/safe-apps-sdk'

import {
  safeEthBalanceSelector,
  safeParamAddressFromStateSelector,
  safeNameSelector,
} from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { getNetworkName } from 'src/config'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { isSameURL } from 'src/utils/url'

import ConfirmTransactionModal from '../components/ConfirmTransactionModal'
import { useIframeMessageHandler } from '../hooks/useIframeMessageHandler'
import { useLegalConsent } from '../hooks/useLegalConsent'
import LegalDisclaimer from './LegalDisclaimer'
import { getAppInfoFromUrl } from '../utils'
import { SafeApp } from '../types.d'

const StyledIframe = styled.iframe`
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const IframeWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const ContentWrapper = styled(Card)`
  height: calc(100% - 73px);
  width: calc(100% - 50px);
  margin: 20px 0;
  overflow: auto;
`

type ConfirmTransactionModalState = {
  isOpen: boolean
  txs: Transaction[]
  requestId?: RequestId
  params?: SendTransactionParams
}

type Props = {
  appUrl: string
}

const NETWORK_NAME = getNetworkName()

const INITIAL_CONFIRM_TX_MODAL_STATE: ConfirmTransactionModalState = {
  isOpen: false,
  txs: [],
  requestId: undefined,
  params: undefined,
}

const AppFrame = ({ appUrl }: Props): React.ReactElement => {
  const granted = useSelector(grantedSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const safeName = useSelector(safeNameSelector)

  const history = useHistory()
  const { consentReceived, onConsentReceipt } = useLegalConsent()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [confirmTransactionModal, setConfirmTransactionModal] = useState<ConfirmTransactionModalState>(
    INITIAL_CONFIRM_TX_MODAL_STATE,
  )
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [selectedApp, setSelectedApp] = useState<SafeApp | undefined>()

  const redirectToBalance = () => history.push(`${SAFELIST_ADDRESS}/${safeAddress}/balances`)

  const openConfirmationModal = useCallback(
    (txs: Transaction[], params: SendTransactionParams | undefined, requestId: RequestId) =>
      setConfirmTransactionModal({
        isOpen: true,
        txs,
        requestId,
        params,
      }),
    [setConfirmTransactionModal],
  )
  const closeConfirmationModal = useCallback(() => setConfirmTransactionModal(INITIAL_CONFIRM_TX_MODAL_STATE), [
    setConfirmTransactionModal,
  ])

  const { sendMessageToIframe } = useIframeMessageHandler(
    selectedApp,
    openConfirmationModal,
    closeConfirmationModal,
    iframeRef,
  )

  const onIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !isSameURL(iframe.src, appUrl as string)) {
      return
    }

    setAppIsLoading(false)
    sendMessageToIframe({
      messageId: INTERFACE_MESSAGES.ON_SAFE_INFO,
      data: {
        safeAddress: safeAddress as string,
        network: NETWORK_NAME.toLowerCase() as LowercaseNetworks,
        ethBalance: ethBalance as string,
      },
    })
  }, [ethBalance, safeAddress, appUrl, sendMessageToIframe])

  const onUserTxConfirm = (safeTxHash: string) => {
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_CONFIRMED, data: { safeTxHash } },
      confirmTransactionModal.requestId,
    )
  }

  const onTxReject = () => {
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_REJECTED, data: {} },
      confirmTransactionModal.requestId,
    )
  }

  useEffect(() => {
    const loadApp = async () => {
      const app = await getAppInfoFromUrl(appUrl)
      setSelectedApp(app)
    }

    loadApp()
  }, [appUrl])

  // TODO check if URL
  if (!appUrl) {
    throw Error('App url No provided or it is invalid.')
  }

  if (!selectedApp) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  if (!consentReceived) {
    return <LegalDisclaimer onCancel={redirectToBalance} onConfirm={onConsentReceipt} />
  }

  if (NETWORK_NAME === 'UNKNOWN' || !granted) {
    return (
      <Centered style={{ height: '476px' }}>
        <FixedIcon type="notOwner" />
        <Title size="xs">To use apps, you must be an owner of this Safe</Title>
      </Centered>
    )
  }

  return (
    <ContentWrapper>
      {/* <Menu>
        <ManageApps appList={appList} onAppAdded={onAppAdded} onAppToggle={onAppToggle} onAppRemoved={onAppRemoved} />
      </Menu> */}
      <IframeWrapper>
        {appIsLoading && (
          <LoadingContainer>
            <Loader size="md" />
          </LoadingContainer>
        )}
        <StyledIframe
          frameBorder="0"
          id={`iframe-${appUrl}`}
          ref={iframeRef}
          src={appUrl}
          title={appUrl} // TODO: Change it!
          onLoad={onIframeLoad}
        />
      </IframeWrapper>

      <ConfirmTransactionModal
        isOpen={confirmTransactionModal.isOpen}
        app={selectedApp as SafeApp}
        safeAddress={safeAddress}
        ethBalance={ethBalance as string}
        safeName={safeName as string}
        txs={confirmTransactionModal.txs}
        onClose={closeConfirmationModal}
        onUserConfirm={onUserTxConfirm}
        params={confirmTransactionModal.params}
        onTxReject={onTxReject}
      />
    </ContentWrapper>
  )
}

export default AppFrame
