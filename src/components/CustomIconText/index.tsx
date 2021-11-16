import { ReactElement } from 'react'
import PrefixedEthHashInfo from '../PrefixedEthHashInfo'

type Props = {
  address: string
  iconUrl?: string
  iconUrlFallback?: string
  text?: string
}

export const CustomIconText = ({ address, iconUrl, text, iconUrlFallback }: Props): ReactElement => (
  <PrefixedEthHashInfo
    hash={address}
    showHash={false}
    avatarSize="sm"
    showAvatar
    customAvatar={iconUrl || undefined}
    customAvatarFallback={iconUrlFallback}
    name={text}
    textSize="xl"
  />
)
