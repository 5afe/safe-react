import React, { forwardRef } from 'react'
import styled from 'styled-components'
import { FixedIcon, Loader, Title } from '@gnosis.pm/safe-react-components'
import { useHistory } from 'react-router-dom'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { useLegalConsent } from '../hooks/useLegalConsent'
import { SafeApp } from '../types'
import LegalDisclaimer from './LegalDisclaimer'

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

type AppFrameProps = {
  selectedApp: SafeApp | undefined
  safeAddress: string
  network: string
  granted: boolean
  appIsLoading: boolean
  onIframeLoad: () => void
}

const AppFrame = forwardRef<HTMLIFrameElement, AppFrameProps>(function AppFrameComponent(
  { selectedApp, safeAddress, network, appIsLoading, granted, onIframeLoad },
  iframeRef,
): React.ReactElement {
  const history = useHistory()
  const { consentReceived, onConsentReceipt } = useLegalConsent()
  const redirectToBalance = () => history.push(`${SAFELIST_ADDRESS}/${safeAddress}/balances`)

  if (!selectedApp) {
    return <div />
  }

  if (!consentReceived) {
    return <LegalDisclaimer onCancel={redirectToBalance} onConfirm={onConsentReceipt} />
  }

  if (network === 'UNKNOWN' || !granted) {
    return (
      <Centered style={{ height: '476px' }}>
        <FixedIcon type="notOwner" />
        <Title size="xs">To use apps, you must be an owner of this Safe</Title>
      </Centered>
    )
  }

  return (
    <IframeWrapper>
      {appIsLoading && (
        <LoadingContainer>
          <Loader size="md" />
        </LoadingContainer>
      )}
      <StyledIframe
        frameBorder="0"
        id={`iframe-${selectedApp.name}`}
        ref={iframeRef}
        src={selectedApp.url}
        title={selectedApp.name}
        onLoad={onIframeLoad}
      />
    </IframeWrapper>
  )
})

export default AppFrame
