import { ReactElement } from 'react'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'

import { getExplorerInfo } from 'src/config'
import { useKnownAddress } from './hooks/useKnownAddress'

type EthHashInfoRestProps = Omit<
  Parameters<typeof PrefixedEthHashInfo>[0],
  'hash' | 'name' | 'showAvatar' | 'customAvatar' | 'showCopyBtn' | 'explorerUrl'
>

type Props = EthHashInfoRestProps & {
  address: string
  name?: string | undefined
  avatarUrl?: string | undefined
}

export const AddressInfo = ({ address, name, avatarUrl, ...rest }: Props): ReactElement | null => {
  const toInfo = useKnownAddress({ value: address, name: name || null, logoUri: avatarUrl || null })

  if (address === '') {
    return null
  }

  return (
    <PrefixedEthHashInfo
      hash={address}
      name={toInfo.name || undefined}
      showAvatar
      customAvatar={toInfo.logoUri || undefined}
      showCopyBtn
      explorerUrl={getExplorerInfo(address)}
      {...rest}
    />
  )
}
