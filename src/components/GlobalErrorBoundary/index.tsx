import React from 'react'
import styled from 'styled-components'
import { Text, Icon, FixedIcon, Title, Button } from '@gnosis.pm/safe-react-components'

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

const StyledButton = styled(Button)`
  span.MuiButton-label {
    svg {
      margin-right: 5px;
    }
  }
`

type Props = {
  error: Error
  componentStack: string
  resetError: () => void
}

const GlobalErrorBoundaryFallback = ({ error, componentStack }: Props): React.ReactElement => {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <Wrapper>
      <Content>
        <Title size="md">Something went wrong, please try again.</Title>
        <FixedIcon type="networkError" />
        {!isProduction && (
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
        {isProduction && (
          <>
            <Text size="xl" color="error">
              {error.toString()}
            </Text>
            <Text size="md" color="error">
              {componentStack}
            </Text>
          </>
        )}
        <StyledButton
          size="md"
          color="primary"
          iconType="home"
          variant="contained"
          onClick={() => {
            window.location.href = '/app/'
          }}
        >
          Go to Home
        </StyledButton>
      </Content>
    </Wrapper>
  )
}

export default GlobalErrorBoundaryFallback
