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
} from '@gnosis.pm/safe-apps-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, MutableRefObject } from 'react'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

type InterfaceMessageProps<T extends InterfaceMessageIds> = {
  messageId: T
  data: InterfaceMessageToPayload[T]
}

type ReturnType = {
  sendMessageToIframe: <T extends InterfaceMessageIds>(message: InterfaceMessageProps<T>, requestId?: RequestId) => void
}

interface CustomMessageEvent extends MessageEvent {
  requestId: RequestId
  data: {
    messageId: SDKMessageIds
    data: SDKMessageToPayload[SDKMessageIds]
  }
}

interface InterfaceMessageRequest extends InterfaceMessageProps<InterfaceMessageIds> {
  requestId: number | string
}

const useIframeMessageHandler = (
  selectedApp: SafeApp | undefined,
  openConfirmationModal: (txs: Transaction[], requestId: RequestId) => void,
  closeModal: () => void,
  iframeRef: MutableRefObject<HTMLIFrameElement>,
): ReturnType => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const network = useSelector(networkSelector)
  const dispatch = useDispatch()

  const sendMessageToIframe = useCallback(
    function <T extends InterfaceMessageIds>(message: InterfaceMessageProps<T>, requestId?: RequestId) {
      const requestWithMessage = {
        ...message,
        requestId: requestId || Math.trunc(window.performance.now()),
      }

      if (iframeRef?.current && selectedApp) {
        iframeRef.current.contentWindow.postMessage(requestWithMessage, selectedApp.url)
      }
    },
    [iframeRef, selectedApp],
  )

  useEffect(() => {
    const handleIframeMessage = (msg: CustomMessageEvent) => {
      if (!msg?.data.messageId) {
        console.error('ThirdPartyApp: A message was received without message id.')
        return
      }
      const { requestId } = msg
      switch (msg.data.messageId) {
        case SDK_MESSAGES.SEND_TRANSACTIONS: {
          openConfirmationModal(msg.data.data, requestId)
          break
        }

        case SDK_MESSAGES.SAFE_APP_SDK_INITIALIZED: {
          const message = {
            messageId: INTERFACE_MESSAGES.ON_SAFE_INFO,
            data: {
              safeAddress,
              network: network,
              ethBalance,
            },
          }

          sendMessageToIframe(message)
          break
        }
        default: {
          console.error(`ThirdPartyApp: A message was received with an unknown message id ${msg.data.messageId}.`)
          break
        }
      }
    }
    const onIframeMessage = async (message: CustomMessageEvent) => {
      if (message.origin === window.origin) {
        return
      }
      if (!selectedApp.url.includes(message.origin)) {
        console.error(`ThirdPartyApp: A message was received from an unknown origin ${message.origin}`)
        return
      }
      handleIframeMessage(message)
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
    network,
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
