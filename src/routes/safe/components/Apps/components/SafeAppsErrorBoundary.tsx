import React, { ReactNode, ErrorInfo } from 'react'
import styled from 'styled-components'
import { Text, Link, Icon, FixedIcon, Title } from '@gnosis.pm/safe-react-components'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { extractPrefixedSafeAddress, generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'

type SafeAppsErrorBoundaryProps = {
  children?: ReactNode
} & RouteComponentProps

type SafeAppsErrorBoundaryState = {
  hasError: boolean
  error?: Error
}

class SafeAppsErrorBoundary extends React.Component<SafeAppsErrorBoundaryProps, SafeAppsErrorBoundaryState> {
  public state: SafeAppsErrorBoundaryState = {
    hasError: false,
  }

  constructor(props: SafeAppsErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }

    this.handleGoBack = this.handleGoBack.bind(this)
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo)
  }

  public static getDerivedStateFromError(error: Error): SafeAppsErrorBoundaryState {
    return { hasError: true, error }
  }

  private handleGoBack(): void {
    this.props.history.push(generateSafeRoute(SAFE_ROUTES.APPS, extractPrefixedSafeAddress()))
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Wrapper>
          <Content>
            <Title size="md">Safe App cold not be loaded.</Title>
            <FixedIcon type="networkError" />

            <div>
              <Text size="xl" as="span">
                In case the problem persists, please reach out to us via{' '}
              </Text>
              <LinkWrapper>
                <a target="_blank" href="https://chat.gnosis-safe.io" rel="noopener noreferrer">
                  <Text color="primary" size="lg" as="span">
                    Discord
                  </Text>
                </a>
                <Icon type="externalLink" color="primary" size="sm" />
              </LinkWrapper>
            </div>

            <Link size="lg" color="primary" onClick={this.handleGoBack}>
              Go back to the Safe Apps list
            </Link>
          </Content>
        </Wrapper>
      )
    }

    return this.props.children
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

export default withRouter(SafeAppsErrorBoundary)
