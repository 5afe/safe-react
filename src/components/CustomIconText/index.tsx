import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

type Props = {
  iconUrl?: string
  iconUrlFallback?: string
  text?: string
}

export const CustomIconText = ({ iconUrl, text, iconUrlFallback }: Props): ReactElement => (
  <EthHashInfo
    hash=""
    avatarSize="sm"
    showAvatar
    customAvatar={iconUrl || undefined}
    customAvatarFallback={iconUrlFallback}
    name={text}
    textSize="xl"
  />
)
