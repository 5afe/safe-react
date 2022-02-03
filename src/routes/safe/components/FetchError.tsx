import { ReactElement } from 'react'
import { Title } from '@gnosis.pm/safe-react-components'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Button from 'src/components/layout/Button'

interface FetchErrorProps {
  text: string
  buttonText: string
  redirectRoute: string
}

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
  const history = useHistory()

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault()
    history.push(redirectRoute)
  }

  return (
    <ErrorContainer>
      <img src="./resources/error.png" alt="Error" />

      <Title size="xs">{text}</Title>

      <Button onClick={onClick} color="primary" size="medium" variant="contained">
        {buttonText}
      </Button>
    </ErrorContainer>
  )
}

export default FetchError
