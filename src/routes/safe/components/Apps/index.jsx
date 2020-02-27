// @flow
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { withSnackbar } from 'notistack'

import appsList from './appsList'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'

import { ListContentLayout as LCL, Loader } from '~/components-v2'
import ButtonLink from '~/components/layout/ButtonLink'

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
  enqueueSnackbar: Function,
  closeSnackbar: Function,
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
  enqueueSnackbar,
  closeSnackbar,
}: Props) {
  const [selectedApp, setSelectedApp] = useState(1)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setframeEl] = useState(null)

  const getSelectedApp = () => appsList.find(e => e.id === selectedApp)

  const sendMessageToIframe = (messageId, data) => {
    iframeEl.contentWindow.postMessage({ messageId, data }, getSelectedApp().url)
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
            data.data,
            enqueueSnackbar,
            closeSnackbar,
            getSelectedApp().name,
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
          getSelectedApp().iconUrl,
          data.data,
          openModal,
          closeModal,
          onConfirm,
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
    const onIframeMessage = async ({ data, origin }) => {
      if (origin === window.origin) {
        return
      }

      if (origin !== getSelectedApp().url) {
        console.error(`Message from ${origin} is different to the App URL ${getSelectedApp().url}`)
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
          frameBorder="0"
          id="iframeId"
          ref={iframeRef}
          shouldDisplay={!appIsLoading}
          src={getSelectedApp().url}
          title="app"
        />
      </>
    )
  }

  return (
    <LCL.Wrapper>
      <LCL.Nav>
        <ButtonLink onClick={() => {}} size="lg" testId="manage-tokens-btn">
          Manage Apps
        </ButtonLink>
      </LCL.Nav>
      <LCL.Menu>
        <LCL.List activeItem={selectedApp} items={appsList} onItemClick={onSelectApp} />
      </LCL.Menu>
      <LCL.Content>{getContent()}</LCL.Content>
      <LCL.Footer>
        This App is provided by{' '}
        <ButtonLink
          onClick={() => window.open(getSelectedApp().providedBy.url, '_blank')}
          size="lg"
          testId="manage-tokens-btn"
        >
          {getSelectedApp().providedBy.name}
        </ButtonLink>
      </LCL.Footer>
    </LCL.Wrapper>
  )
}

export default withSnackbar(Apps)
