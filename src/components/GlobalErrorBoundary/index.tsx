import React, { useEffect, useLayoutEffect } from 'react'
import styled from 'styled-components'
import { Text, Link, Icon, FixedIcon, Title } from '@gnosis.pm/safe-react-components'

import { IS_PRODUCTION } from 'src/utils/constants'
import { ErrorBoundaryProps, FallbackRender } from '@sentry/react/dist/errorboundary'

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

const GlobalErrorBoundaryFallback = ({ error, componentStack }: any) => {
  //  When loading app during release, chunk load failure may occur
  const chunkFailedMessage = /Loading chunk [\d]+ failed/
  const isChunkError = error?.message && chunkFailedMessage.test(error.message)

  const time = new Date().getTime()
  const key = 'lastReload'
  const lastReloadString = localStorage.getItem(key)
  const lastReload = lastReloadString && JSON.parse(lastReloadString)

  // Expires 10 secs after last chunk failure reload
  const isExpired = time > +lastReload + 10000

  if (isChunkError && isExpired) {
    localStorage.setItem(key, JSON.stringify(time))
    window.location.reload()

    return null
  } else {
    localStorage.removeItem(key)
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
