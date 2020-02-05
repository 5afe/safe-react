// @flow
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import sendTransactions from './sendTransactions'

const AppsWrapper = styled.div`
  margin: 15px;
`

const operations = {
  SEND_TRANSACTIONS: 'sendTransactions',
  GET_TRANSACTIONS: 'getTransactions',
  ON_SAFE_INFO: 'onSafeInfo',
  ON_TX_UPDATE: 'onTransactionUpdate',
}

type Props = {
  web3: any,
  safeAddress: String,
  network: String,
  createTransaction: any
}

function Apps({
  web3, safeAddress, network, createTransaction,
}: Props) {
  const iframeUrl = 'http://localhost:3002'

  const [selectedApp, setSelectedApp] = useState(null)
  const [appIsLoading, setAppIsLoading] = useState(false)
  const [iframeEl, seIframeEl] = useState(null)

  const sendMessageToIframe = (messageId, data) => {
    iframeEl.contentWindow.postMessage({ messageId, data }, iframeUrl)
  }

  const handleIframeMessage = async (data) => {
    if (!data || !data.messageId) {
      console.warn('iframe: message without messageId')
      return
    }

    switch (data.messageId) {
      case operations.SEND_TRANSACTIONS: {
        const txHash = await sendTransactions(
          web3,
          createTransaction,
          safeAddress,
          data.data,
        )

        if (txHash) {
          sendMessageToIframe(operations.ON_TX_UPDATE, {
            txHash,
            status: 'pending',
          })
        }

        break
      }
      case operations.GET_TRANSACTIONS:
        break

      default: {
        console.warn(`Iframe:${data.messageId} unkown`)
        break
      }
    }
  }

  const iframeRef = useCallback((node) => {
    if (node !== null) {
      seIframeEl(node)
    }
  }, [])

  useEffect(() => {
    const onIframeMessage = async ({ origin, data }) => {
      if (origin !== iframeUrl) {
        return
      }

      handleIframeMessage(data)
    }
    window.addEventListener('message', onIframeMessage)

    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  }, [])

  useEffect(() => {
    const onIframeLoaded = () => {
      setAppIsLoading(false)
      sendMessageToIframe(operations.ON_SAFE_INFO, {
        safeAddress,
        network,
      })
    }

    if (!iframeEl) {
      return
    }

    iframeEl.addEventListener('load', onIframeLoaded)

    return () => {
      iframeEl.removeEventListener('load', onIframeLoaded)
    }
  }, [iframeEl])

  const selectApp = () => {
    setAppIsLoading(true)
    setSelectedApp({ url: `${iframeUrl}?id=2` })
  }

  return (
    <AppsWrapper>
      <button type="button" onClick={selectApp}>
        load app
      </button>

      {selectedApp && appIsLoading && 'Loading app...'}

      {selectedApp && (
        <iframe
          id="iframeId"
          title="app"
          ref={iframeRef}
          src={selectedApp.url}
          height="350"
          width="100%"
        />
      )}
    </AppsWrapper>
  )
}

export default Apps
