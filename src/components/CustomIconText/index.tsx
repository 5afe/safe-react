import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'

type Props = { iconUrl: string | null | undefined; text?: string | undefined }

export const CustomIconText = ({ iconUrl, text }: Props): ReactElement => (
  <EthHashInfo hash="" avatarSize="sm" showAvatar customAvatar={iconUrl || undefined} name={text} textSize="xl" />
)
