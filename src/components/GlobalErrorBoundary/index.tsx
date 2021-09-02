import React from 'react'
import styled from 'styled-components'
import { Text, Link, Icon, FixedIcon, Title } from '@gnosis.pm/safe-react-components'
import { IS_PRODUCTION } from 'src/utils/constants'
import { FallbackRender } from '@sentry/react/dist/errorboundary'

const Wrapper = styled.div`
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Content = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  > * {
    margin-top: 10px;
  }
`

const LinkWrapper = styled.div`
  display: inline-flex;
  margin-bottom: 10px;

  > :first-of-type {
    margin-right: 5px;
  }
`

const LinkContent = styled.div`
  display: flex;
  align-items: center;

  > span {
    margin-right: 5px;
  }
`

export const lastFallbackReloadKey = 'SAFE__lastFallbackReload'

//  When loading app during release, chunk load failure may occur
export const handleChunkError = (error: Error): boolean | void => {
  const chunkFailedMessage = /Loading chunk [\d]+ failed/
  const isChunkError = error?.message && chunkFailedMessage.test(error.message)

  if (!isChunkError) return

  const lastReloadString = sessionStorage.getItem(lastFallbackReloadKey)
  const lastReload = lastReloadString ? +lastReloadString : 0

  // Not a time value - remove it
  if (isNaN(lastReload)) {
    sessionStorage.removeItem(lastFallbackReloadKey)
    return
  }

  const now = new Date().getTime()
  const MIN_RELOAD_TIME = 10e3

  const hasJustReloaded = lastReload + MIN_RELOAD_TIME > now

  if (!hasJustReloaded) {
    sessionStorage.setItem(lastFallbackReloadKey, now.toString())
    window.location.reload()
    return true
  }
}

const GlobalErrorBoundaryFallback: FallbackRender = ({ error, componentStack }) => {
  if (handleChunkError(error)) {
    return null
  }

  return (
    <Wrapper>
      <Content>
        <Title size="md">Something went wrong, please try again.</Title>
        <FixedIcon type="networkError" />
        {IS_PRODUCTION && (
          <div>
            <Text size="xl" as="span">
              In case the problem persists, please reach out to us via{' '}
            </Text>
            <LinkWrapper>
              <a target="_blank" href="email: mailto:safe@gnosis.io" rel="noopener noreferrer">
                <Text color="primary" size="lg" as="span">
                  Email
                </Text>
              </a>
              <Icon type="externalLink" color="primary" size="sm" />
            </LinkWrapper>
            or{' '}
            <LinkWrapper>
              <a target="_blank" href="https://discordapp.com/invite/FPMRAwK" rel="noopener noreferrer">
                <Text color="primary" size="lg" as="span">
                  Discord
                </Text>
              </a>
              <Icon type="externalLink" color="primary" size="sm" />
            </LinkWrapper>
          </div>
        )}
        {!IS_PRODUCTION && (
          <>
            <Text size="xl" color="error">
              {error.toString()}
            </Text>
            <Text size="md" color="error">
              {componentStack}
            </Text>
          </>
        )}
        <Link size="lg" color="primary" href="/app/">
          <LinkContent>
            <Icon size="md" type="home" color="primary" />
            Go to Home
          </LinkContent>
        </Link>
      </Content>
    </Wrapper>
  )
}

export default GlobalErrorBoundaryFallback
