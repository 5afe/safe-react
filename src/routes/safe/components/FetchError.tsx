import { ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { Title } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import Button from 'src/components/layout/Button'

interface FetchErrorProps {
  text: string
  buttonText: string
  redirectRoute: string
}

const StyledLink = styled(Link)`
  text-decoration: none;
`

const ErrorContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // Offset so that it is centered relative to the header
  margin-top: -30px;
`

const FetchError = ({ text, buttonText, redirectRoute }: FetchErrorProps): ReactElement => {
  return (
    <ErrorContainer>
      <img src="./resources/error.png" alt="Error" />

      <Title size="xs">{text}</Title>

      <StyledLink to={redirectRoute}>
        <Button color="primary" size="medium" variant="contained">
          {buttonText}
        </Button>
      </StyledLink>
    </ErrorContainer>
  )
}

export default FetchError
