// @flow
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import ButtonLink from '../../../../components/layout/ButtonLink'
import { Loader, ListContentLayout as LCL } from '~/components-v2'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'

import appsList from './appsList'

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  display: ${props => (props.shouldDisplay ? 'block' : 'none')};
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
  safeName: String,
  ethBalance: String,
  network: String,
  createTransaction: any,
  openModal: () => {},
  closeModal: () => {},
}

function Apps({
  web3,
  safeAddress,
  safeName,
  ethBalance,
  network,
  createTransaction,
  openModal,
  closeModal,
}: Props) {
  const [selectedApp, setSelectedApp] = useState(1)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setframeEl] = useState(null)

  const getSelectedApp = () => appsList.find(e => e.id === selectedApp)

  const sendMessageToIframe = (messageId, data) => {
    iframeEl.contentWindow.postMessage(
      { messageId, data },
      getSelectedApp().url
    )
  }

  const handleIframeMessage = async data => {
    if (!data || !data.messageId) {
      console.warn('iframe: message without messageId')
      return
    }

    switch (data.messageId) {
      case operations.SEND_TRANSACTIONS: {
        const onConfirm = async () => {
          closeModal()

          const txHash = await sendTransactions(
            web3,
            createTransaction,
            safeAddress,
            data.data
          )

          if (txHash) {
            sendMessageToIframe(operations.ON_TX_UPDATE, {
              txHash,
              status: 'pending',
            })
          }
        }

        confirmTransactions(
          safeAddress,
          safeName,
          ethBalance,
          data.data,
          openModal,
          closeModal,
          onConfirm
        )

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

  const iframeRef = useCallback(node => {
    if (node !== null) {
      setframeEl(node)
    }
  }, [])

  useEffect(() => {
    const onIframeMessage = async ({ origin, data }) => {
      if (origin !== getSelectedApp().url) {
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

  const onSelectApp = appId => {
    setAppIsLoading(true)
    setSelectedApp(appId)
  }

  const getContent = () => {
    if (!selectedApp) {
      return null
    }

    return (
      <>
        {appIsLoading && <Loader />}
        <StyledIframe
          shouldDisplay={!appIsLoading}
          id="iframeId"
          frameBorder="0"
          title="app"
          ref={iframeRef}
          src={getSelectedApp().url}
        />
      </>
    )
  }

  return (
    <LCL.Wrapper>
      <LCL.Nav>
        <ButtonLink size="lg" onClick={() => {}} testId="manage-tokens-btn">
          Manage Apps
        </ButtonLink>
      </LCL.Nav>
      <LCL.Menu>
        <LCL.List
          items={appsList}
          activeItem={selectedApp}
          onItemClick={onSelectApp}
        />
      </LCL.Menu>
      <LCL.Content>{getContent()}</LCL.Content>
      <LCL.Footer>
        This App is provided by{' '}
        <ButtonLink
          size="lg"
          onClick={() => window.open(getSelectedApp().providedBy.url, '_blank')}
          testId="manage-tokens-btn"
        >
          {getSelectedApp().providedBy.name}
        </ButtonLink>
      </LCL.Footer>
    </LCL.Wrapper>
  )
}

export default Apps
