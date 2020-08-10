import { useSnackbar } from 'notistack'
import {
  FromSafeMessages,
  FromMessageToPayload,
  ToSafeMessages,
  ToMessageToPayload,
  TO_SAFE_MESSAGES,
  Networks,
} from '@gnosis.pm/safe-apps-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, MutableRefObject } from 'react'
import { OpenModalArgs } from 'src/routes/safe/components/Layout/interfaces'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

import sendTransactions from '../sendTransactions'
import confirmTransactions from '../confirmTransactions'

type ReturnType = {
  sendMessageToIframe: <T extends keyof FromSafeMessages>(messageId: T, data: FromMessageToPayload[T]) => void
}

interface CustomMessageEvent extends MessageEvent {
  data: {
    messageId: keyof ToSafeMessages
    data: ToMessageToPayload[keyof ToSafeMessages]
  }
}

const useIframeMessageHandler = (
  selectedApp: SafeApp | undefined,
  openModal: (modal: OpenModalArgs) => void,
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
    function <T extends keyof FromSafeMessages>(messageId: T, data: FromMessageToPayload[T]) {
      if (iframeRef?.current && selectedApp) {
        iframeRef.current.contentWindow.postMessage({ messageId, data }, selectedApp.url)
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
      switch (msg.data.messageId) {
        case TO_SAFE_MESSAGES.SEND_TRANSACTIONS: {
          const onConfirm = async () => {
            closeModal()
            await sendTransactions(dispatch, safeAddress, msg.data.data, enqueueSnackbar, closeSnackbar, selectedApp.id)
          }
          confirmTransactions(
            safeAddress,
            safeName,
            ethBalance,
            selectedApp.name,
            selectedApp.iconUrl,
            msg.data.data,
            openModal,
            closeModal,
            onConfirm,
          )
          break
        }

        case TO_SAFE_MESSAGES.SAFE_APP_SDK_INITIALIZED: {
          // TODO: export this from safe-apps-sdk
          sendMessageToIframe('ON_SAFE_INFO', {
            safeAddress,
            network: network as Networks,
            ethBalance,
          })
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
    openModal,
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
