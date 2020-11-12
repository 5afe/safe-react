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
  object-fit: cover;
`

const Skeleton = styled.div``

const AppIconSK = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  margin: 0 auto;
  background-color: lightgrey;
`
const TitleSK = styled.div`
  height: 24px;
  width: 160px;
  margin: 24px auto;
  background-color: lightgrey;
`
const DescriptionSK = styled.div`
  height: 16px;
  width: 200px;
  margin: 8px auto;
  background-color: lightgrey;
`

const AppName = styled(Title)`
  text-align: center;
`

const AppDescription = styled(Text)`
  height: 40px;
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
        <Skeleton>
          <AppIconSK />
          <TitleSK />
          <DescriptionSK />
          <DescriptionSK />
        </Skeleton>
      </StyledApps>
    )
  }

  return (
    <StyledApps className={className} onClick={onButtonClick ? () => undefined : onCardClick}>
      <IconImg alt={`${name || 'App'} Logo`} src={iconUrl} onError={setAppImageFallback} size={iconSize} />

      {name && <AppName size="sm">{name}</AppName>}
      {description && <AppDescription size="lg">{description} </AppDescription>}

      {onButtonClick && (
        <Button size="md" color="primary" variant="contained" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </StyledApps>
  )
}

export default Apps
