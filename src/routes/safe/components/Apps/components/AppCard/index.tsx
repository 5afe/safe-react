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

const IconImg = styled.img<{ size: 'md' | 'lg' }>`
  width: ${({ size }) => (size === 'md' ? '48px' : '102px')};
  height: ${({ size }) => (size === 'md' ? '60px' : '92px')};
  object-fit: contain;
`

const AppIconSK = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin: 0 auto;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;

  -webkit-animation: gradient-SK 1.5s ease infinite;
  -moz-animation: gradient-SK 1.5s ease infinite;
  -o-animation: gradient-SK 1.5s ease infinite;
  animation: gradient-SK 1.5s ease infinite;

  @-webkit-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-moz-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-o-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
`
const TitleSK = styled.div`
  height: 24px;
  width: 160px;
  margin: 24px auto;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;

  -webkit-animation: gradient-SK 1.5s ease infinite;
  -moz-animation: gradient-SK 1.5s ease infinite;
  -o-animation: gradient-SK 1.5s ease infinite;
  animation: gradient-SK 1.5s ease infinite;

  @-webkit-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-moz-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-o-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
`
const DescriptionSK = styled.div`
  height: 16px;
  width: 200px;
  background-color: lightgrey;
  background: linear-gradient(84deg, lightgrey, transparent);
  background-size: 400% 400%;

  -webkit-animation: gradient-SK 1.5s ease infinite;
  -moz-animation: gradient-SK 1.5s ease infinite;
  -o-animation: gradient-SK 1.5s ease infinite;
  animation: gradient-SK 1.5s ease infinite;

  @-webkit-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-moz-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @-o-keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
  @keyframes gradient-SK {
    0% {
      background-position: 0% 54%;
    }
    50% {
      background-position: 100% 47%;
    }
    100% {
      background-position: 0% 54%;
    }
  }
`

type Props = {
  isLoading?: boolean
  className?: string
  name?: string
  description?: string
  iconUrl?: string
  iconSize?: 'md' | 'lg'
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
  iconSize = 'md',
  buttonText,
  onButtonClick,
  onCardClick,
}: Props): React.ReactElement => {
  if (isLoading) {
    return (
      <StyledApps className={className}>
        <AppIconSK />
        <TitleSK />
        <DescriptionSK />
        <DescriptionSK />
      </StyledApps>
    )
  }

  return (
    <StyledApps className={className} onClick={onButtonClick ? () => undefined : onCardClick}>
      <IconImg alt={`${name || 'App'} Logo`} src={iconUrl} onError={setAppImageFallback} size={iconSize} />

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
