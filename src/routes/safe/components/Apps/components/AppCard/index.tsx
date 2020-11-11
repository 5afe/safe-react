import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { Title, Text, Button } from '@gnosis.pm/safe-react-components'

import appsIconSvg from 'src/assets/icons/apps.svg'

const StyledApps = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  box-shadow: 1px 2px 10px 0 ${({ theme }) => fade(theme.colors.shadow.color, 0.18)};
  border-radius: 8px;
  padding: 24px;
  margin: 10px;
  background-color: ${({ theme }) => theme.colors.white};
  width: 244px;
  height: 232px;

  :hover {
    box-shadow: 1px 2px 16px 0 ${({ theme }) => fade(theme.colors.shadow.color, 0.35)};
    transition: box-shadow 0.3s ease-in-out;
    cursor: pointer;

    h4 {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const IconImg = styled.img`
  width: 92px;
`

type Props = {
  isLoading?: boolean
  className?: string
  name?: string
  description?: string
  iconUrl?: string
  buttonText?: string
  onButtonClick?: () => void
  onCardClick?: () => void
}

export const setAppImageFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = appsIconSvg
}

const Apps = ({
  isLoading = false,
  className,
  name,
  description,
  iconUrl,
  buttonText,
  onButtonClick,
  onCardClick,
}: Props): React.ReactElement => {
  if (isLoading) {
    return <div>skeleton</div>
  }

  return (
    <StyledApps className={className} onClick={onButtonClick ? () => undefined : onCardClick}>
      <IconImg alt={`${name || 'App'} Logo`} src={iconUrl} onError={setAppImageFallback} />

      {name && <Title size="sm">{name}</Title>}
      {description && <Text size="lg">{description} </Text>}

      {onButtonClick && (
        <Button size="md" color="primary" variant="contained">
          {buttonText}
        </Button>
      )}
    </StyledApps>
  )
}

export default Apps
