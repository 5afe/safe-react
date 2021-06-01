import { useSnackbar } from 'notistack'
import {
  InterfaceMessageIds,
  InterfaceMessageToPayload,
  SDKMessageIds,
  SDKMessageToPayload,
  SDK_MESSAGES,
  INTERFACE_MESSAGES,
  RequestId,
  Transaction,
  LowercaseNetworks,
} from '@gnosis.pm/safe-apps-sdk-v1'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, MutableRefObject } from 'react'
import { getNetworkName, getTxServiceUrl } from 'src/config/'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/logic/safe/store/selectors'
import { TransactionParams } from '../components/AppFrame'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

type InterfaceMessageProps<T extends InterfaceMessageIds> = {
  messageId: T
  data: InterfaceMessageToPayload[T]
}

type ReturnType = {
  sendMessageToIframe: <T extends InterfaceMessageIds>(message: InterfaceMessageProps<T>, requestId?: RequestId) => void
}

const NETWORK_NAME = getNetworkName()

const useIframeMessageHandler = (
  selectedApp: SafeApp | undefined,
  openConfirmationModal: (txs: Transaction[], params: TransactionParams | undefined, requestId: RequestId) => void,
  closeModal: () => void,
  iframeRef: MutableRefObject<HTMLIFrameElement | null>,
): ReturnType => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()

  const sendMessageToIframe = useCallback(
    function <T extends InterfaceMessageIds>(message: InterfaceMessageProps<T>, requestId?: RequestId) {
      const requestWithMessage = {
        ...message,
        requestId: requestId || Math.trunc(window.performance.now()),
        version: '0.4.2',
      }

      if (iframeRef && selectedApp) {
        iframeRef.current?.contentWindow?.postMessage(requestWithMessage, selectedApp.url)
      }
    },
    [iframeRef, selectedApp],
  )

  useEffect(() => {
    const handleIframeMessage = (
      messageId: SDKMessageIds,
      messagePayload: SDKMessageToPayload[typeof messageId],
      requestId: RequestId,
    ): void => {
      if (!messageId) {
        return
      }

      switch (messageId) {
        // typescript doesn't narrow type in switch/case statements
        // issue: https://github.com/microsoft/TypeScript/issues/20375
        // possible solution: https://stackoverflow.com/a/43879897/7820085
        case SDK_MESSAGES.SEND_TRANSACTIONS: {
          if (messagePayload) {
            openConfirmationModal(
              messagePayload as SDKMessageToPayload[typeof SDK_MESSAGES.SEND_TRANSACTIONS],
              undefined,
              requestId,
            )
          }
          break
        }

        case SDK_MESSAGES.SAFE_APP_SDK_INITIALIZED: {
          const safeInfoMessage = {
            messageId: INTERFACE_MESSAGES.ON_SAFE_INFO,
            data: {
              safeAddress: safeAddress as string,
              network: NETWORK_NAME.toLowerCase() as LowercaseNetworks,
              ethBalance: ethBalance as string,
            },
          }
          const envInfoMessage = {
            messageId: INTERFACE_MESSAGES.ENV_INFO,
            data: {
              txServiceUrl: getTxServiceUrl(),
            },
          }

          sendMessageToIframe(safeInfoMessage)
          sendMessageToIframe(envInfoMessage)
          break
        }
        default: {
          console.error(`ThirdPartyApp: A message was received with an unknown message id ${messageId}.`)
          break
        }
      }
    }
    const onIframeMessage = async (
      message: MessageEvent<{
        requestId: RequestId
        messageId: SDKMessageIds
        data: SDKMessageToPayload[SDKMessageIds]
      }>,
    ) => {
      if (message.origin === window.origin) {
        return
      }
      if (!selectedApp?.url.includes(message.origin)) {
        console.error(`ThirdPartyApp: A message was received from an unknown origin ${message.origin}`)
        return
      }
      handleIframeMessage(message.data.messageId, message.data.data, message.data.requestId)
    }

    window.addEventListener('message', onIframeMessage)
    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  }, [
    closeModal,
    closeSnackbar,
    dispatch,
    enqueueSnackbar,
    ethBalance,
    openConfirmationModal,
    safeAddress,
    safeName,
    selectedApp,
    sendMessageToIframe,
  ])

  return {
    sendMessageToIframe,
  }
}

export { useIframeMessageHandler }
