import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { Title, Text, Button, Card } from '@gnosis.pm/safe-react-components'

import appsIconSvg from 'src/assets/icons/apps.svg'
import { AppIconSK, DescriptionSK, TitleSK } from './skeleton'

const AppCard = styled(Card)`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  box-shadow: 1px 2px 10px 0 ${({ theme }) => fade(theme.colors.shadow.color, 0.18)};
  height: 232px;
  cursor: default !important;

  :hover {
    box-shadow: 1px 2px 16px 0 ${({ theme }) => fade(theme.colors.shadow.color, 0.35)};
    transition: box-shadow 0.3s ease-in-out;
    cursor: pointer;

    h4 {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const IconImg = styled.img<{ size: 'md' | 'lg'; src: string | undefined }>`
  width: ${({ size }) => (size === 'md' ? '48px' : '102px')};
  height: ${({ size }) => (size === 'md' ? '60px' : '92px')};
  object-fit: contain;
`

const AppName = styled(Title)`
  text-align: center;
`

const AppDescription = styled(Text)`
  height: 40px;
  text-align: center;
`

const ClickableContent = styled.div`
  cursor: pointer;
`

export const setAppImageFallback = (error: SyntheticEvent<HTMLImageElement, Event>): void => {
  error.currentTarget.onerror = null
  error.currentTarget.src = appsIconSvg
}

const ConditionalClickableContent = ({
  isClickable,
  onClick,
  children,
}: {
  isClickable: boolean
  onClick: () => void
  children: React.ReactNode
}): React.ReactElement => <ClickableContent onClick={isClickable ? onClick : undefined}>{children}</ClickableContent>

export enum TriggerType {
  Button,
  Content,
}

type Props = {
  onClick?: () => void
  actionTrigger?: TriggerType
  isLoading?: boolean
  className?: string
  name?: string
  description?: string
  iconUrl?: string
  iconSize?: 'md' | 'lg'
  buttonText?: string
}

const Apps = ({
  isLoading = false,
  className,
  name,
  description,
  iconUrl,
  iconSize = 'md',
  buttonText,
  onClick = () => undefined,
  actionTrigger,
}: Props): React.ReactElement => {
  if (isLoading) {
    return (
      <AppCard className={className}>
        <AppIconSK />
        <TitleSK />
        <DescriptionSK />
        <DescriptionSK />
      </AppCard>
    )
  }

  return (
    <AppCard className={className}>
      <ConditionalClickableContent isClickable={actionTrigger === TriggerType.Content} onClick={onClick}>
        <IconImg alt={`${name || 'App'} Logo`} src={iconUrl} onError={setAppImageFallback} size={iconSize} />
      </ConditionalClickableContent>

      {name && (
        <ConditionalClickableContent isClickable={actionTrigger === TriggerType.Content} onClick={onClick}>
          <AppName size="sm">{name}</AppName>
        </ConditionalClickableContent>
      )}

      {description && (
        <ConditionalClickableContent isClickable={actionTrigger === TriggerType.Content} onClick={onClick}>
          <AppDescription size="lg">{description} </AppDescription>
        </ConditionalClickableContent>
      )}

      {actionTrigger === TriggerType.Button && (
        <Button size="md" color="primary" variant="contained" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </AppCard>
  )
}

export default Apps
