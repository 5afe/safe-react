import { EthHashInfo } from '@gnosis.pm/safe-react-components'
import { ReactElement } from 'react'

import { getExplorerInfo } from 'src/config'
import { useKnownAddress } from './hooks/useKnownAddress'

type EthHashInfoRestProps = Omit<
  Parameters<typeof EthHashInfo>[0],
  | 'hash'
  | 'name'
  | 'showAvatar'
  | 'customAvatar'
  | 'showCopyBtn'
  | 'explorerUrl'
  | 'shouldShowShortName' // The ommission of all shortName props here is to avoid type error that will be solved by merging PR #2896
  | 'shouldCopyShortName'
  | 'shortName'
>

type Props = EthHashInfoRestProps & {
  address: string
  name?: string | undefined
  avatarUrl?: string | undefined
}

export const AddressInfo = ({ address, name, avatarUrl, ...rest }: Props): ReactElement | null => {
  const toInfo = useKnownAddress(address, { name, image: avatarUrl })

  if (address === '') {
    return null
  }

  return (
    <EthHashInfo
      hash={address}
      name={toInfo.name}
      showAvatar
      customAvatar={toInfo.image}
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
      {...rest}
    />
  )
}
