import React from 'react'
import styled from 'styled-components'
import { Card, Text, Title, Button } from '@gnosis.pm/safe-react-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

type Props = {
  error: Error
  componentStack: string
  resetError: () => void
}

const GlobalErrorBoundaryFallback: React.FC<Props> = ({ error, componentStack }: Props) => {
  return (
    <Wrapper>
      <Card>
        <Title size="md">There was an error</Title>
        {process.env.NODE_ENV !== 'production' && (
          <>
            <Text size="xl" color="error">
              {error.toString()}
            </Text>
            <Text size="md" color="error">
              {componentStack}
            </Text>
          </>
        )}
        <Button
          size="md"
          color="primary"
          onClick={() => {
            window.location.href = '/app/'
          }}
        >
          Go to Landing
        </Button>
      </Card>
    </Wrapper>
  )
}

export default GlobalErrorBoundaryFallback
