import React, { useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import {
  FixedIcon,
  Loader,
  Title,
  Text,
  Card,
  GenericModal,
  ModalFooterConfirmation,
  Menu,
  ButtonLink,
} from '@gnosis.pm/safe-react-components'
import { useHistory, useRouteMatch } from 'react-router-dom'
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
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { staticAppsList } from 'src/routes/safe/components/Apps/utils'

import ConfirmTransactionModal from '../components/ConfirmTransactionModal'
import { useIframeMessageHandler } from '../hooks/useIframeMessageHandler'
import { useLegalConsent } from '../hooks/useLegalConsent'
import LegalDisclaimer from './LegalDisclaimer'
import { APPS_STORAGE_KEY, getAppInfoFromUrl } from '../utils'
import { SafeApp, StoredSafeApp } from '../types.d'

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
  height: calc(100% - 127px);
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
  const { trackEvent } = useAnalytics()
  const history = useHistory()
  const { consentReceived, onConsentReceipt } = useLegalConsent()

  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [confirmTransactionModal, setConfirmTransactionModal] = useState<ConfirmTransactionModalState>(
    INITIAL_CONFIRM_TX_MODAL_STATE,
  )
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [safeApp, setSafeApp] = useState<SafeApp | undefined>()
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isAppDeletable, setIsAppDeletable] = useState<boolean | undefined>()

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
    safeApp,
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

  const openRemoveModal = () => setIsRemoveModalOpen(true)

  const closeRemoveModal = () => setIsRemoveModalOpen(false)

  const removeApp = async () => {
    const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
    const filteredList = persistedAppList.filter((a) => a.url !== safeApp?.url)
    saveToStorage(APPS_STORAGE_KEY, filteredList)

    const goToApp = `${matchSafeWithAddress?.url}/apps`
    history.push(goToApp)
  }

  useEffect(() => {
    const loadApp = async () => {
      const app = await getAppInfoFromUrl(appUrl)

      const existsStaticApp = staticAppsList.some((staticApp) => staticApp.url === app.url)
      setIsAppDeletable(!existsStaticApp)
      setSafeApp(app)
    }

    loadApp()
  }, [appUrl])

  //track GA
  useEffect(() => {
    if (safeApp) {
      trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Apps', label: safeApp.name })
    }
  }, [safeApp, trackEvent])

  // TODO check if URL
  if (!appUrl) {
    throw Error('App url No provided or it is invalid.')
  }

  if (!safeApp) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  if (consentReceived === false) {
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
    <>
      <Menu>
        {isAppDeletable && (
          <ButtonLink color="error" iconType="delete" onClick={openRemoveModal}>
            Remove app
          </ButtonLink>
        )}
      </Menu>
      <ContentWrapper>
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

        {isRemoveModalOpen && (
          <GenericModal
            title={
              <Title size="sm" withoutMargin>
                Remove app
              </Title>
            }
            body={<Text size="md">This action will remove {safeApp.name} from the interface</Text>}
            footer={
              <ModalFooterConfirmation
                cancelText="Cancel"
                handleCancel={closeRemoveModal}
                handleOk={removeApp}
                okText="Remove"
              />
            }
            onClose={closeRemoveModal}
          />
        )}

        <ConfirmTransactionModal
          isOpen={confirmTransactionModal.isOpen}
          app={safeApp as SafeApp}
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
    </>
  )
}

export default AppFrame
