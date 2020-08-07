import { useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useCallback, MutableRefObject } from 'react'
import { OpenModalArgs } from 'src/routes/safe/components/Layout/interfaces'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { SafeApp } from 'src/routes/safe/components/Apps/types'

import sendTransactions from '../sendTransactions'
import confirmTransactions from '../confirmTransactions'

const operations = {
  ON_SAFE_INFO: 'ON_SAFE_INFO',
  SAFE_APP_SDK_INITIALIZED: 'SAFE_APP_SDK_INITIALIZED',
  SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
} as const

type ReturnType = {
  sendMessageToIframe: (messageId: any, data: any) => void
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
  const dispatch = useDispatch()

  const sendMessageToIframe = useCallback(
    (messageId, data) => {
      if (iframeRef?.current && selectedApp) {
        iframeRef.current.contentWindow.postMessage({ messageId, data }, selectedApp.url)
      }
    },
    [iframeRef, selectedApp],
  )

  useEffect(() => {
    const handleIframeMessage = (data) => {
      if (!data || !data.messageId) {
        console.error('ThirdPartyApp: A message was received without message id.')
        return
      }
      switch (data.messageId) {
        case operations.SEND_TRANSACTIONS: {
          const onConfirm = async () => {
            closeModal()
            await sendTransactions(dispatch, safeAddress, data.data, enqueueSnackbar, closeSnackbar, selectedApp.id)
          }
          confirmTransactions(
            safeAddress,
            safeName,
            ethBalance,
            selectedApp.name,
            selectedApp.iconUrl,
            data.data,
            openModal,
            closeModal,
            onConfirm,
          )
          break
        }
        default: {
          console.error(`ThirdPartyApp: A message was received with an unknown message id ${data.messageId}.`)
          break
        }
      }
    }
    const onIframeMessage = async ({ data, origin }) => {
      if (origin === window.origin) {
        return
      }
      if (!selectedApp.url.includes(origin)) {
        console.error(`ThirdPartyApp: A message was received from an unknown origin ${origin}`)
        return
      }
      handleIframeMessage(data)
    }

    window.addEventListener('message', onIframeMessage)
    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  }, [closeModal, closeSnackbar, dispatch, enqueueSnackbar, ethBalance, openModal, safeAddress, safeName, selectedApp])

  return {
    sendMessageToIframe,
  }
}

export { useIframeMessageHandler }
