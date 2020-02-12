// @flow
import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'

import ButtonLink from '~/components/layout/ButtonLink'
import Loader from './ListContentLayout/Loader'
import sendTransactions from './sendTransactions'
import { Wrapper, Menu, Content, Footer, Nav } from './ListContentLayout/Layout'
import List from './ListContentLayout/List'

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
  safeAddress: string,
  network: string,
  createTransaction: any,
}

const Apps = ({ web3, safeAddress, network, createTransaction }: Props) => {
  const apps = [
    {
      id: 1,
      name: 'Compound',
      // url: 'http://localhost:3002',
      url: 'https://gnosis-apps.netlify.com/',
      iconUrl: 'https://compound.finance/images/compound-mark.svg',
      description: '',
      providedBy: { name: 'Gnosis', url: '' },
    },
    {
      id: 2,
      name: 'ENS Manager',
      url: '',
      iconUrl: 'https://app.ens.domains/static/media/ensIconLogo.4d995d23.svg',
      description: '',
      providedBy: { name: 'Gnosis', url: '' },
    },
    {
      id: 3,
      name: 'Uniswap',
      url: '',
      iconUrl:
        'https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LNun-MDdANv-PeRglM0%2Favatar.png?generation=1538584950851432&alt=media',
      description: '',
      providedBy: { name: 'Gnosis', url: '' },
    },
    {
      id: 4,
      name: 'Nexus Mutual',
      url: '',
      iconUrl:
        'https://blobscdn.gitbook.com/v0/b/gitbook-28427.appspot.com/o/spaces%2F-LK136DM17k-0Gl82Q9B%2Favatar.png?generation=1534411701476772&alt=media',
      description: '',
      providedBy: {
        name: 'Gnosis',
        url: '',
      },
    },
  ]

  const [selectedApp, setSelectedApp] = useState(1)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setframeEl] = useState(null)

  const getSelectedApp = () => apps.find(e => e.id === selectedApp)

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
    <Wrapper>
      <Nav>
        <ButtonLink size="lg" onClick={() => {}} testId="manage-tokens-btn">
          Manage Apps
        </ButtonLink>
      </Nav>
      <Menu>
        <List items={apps} activeItem={selectedApp} onItemClick={onSelectApp} />
      </Menu>
      <Content>{getContent()}</Content>
      <Footer>
        This App is provided by{' '}
        <ButtonLink
          size="lg"
          onClick={() => window.open(getSelectedApp().providedBy.url, '_blank')}
          testId="manage-tokens-btn"
        >
          {getSelectedApp().providedBy.name}
        </ButtonLink>
      </Footer>
    </Wrapper>
  )
}

export default Apps
