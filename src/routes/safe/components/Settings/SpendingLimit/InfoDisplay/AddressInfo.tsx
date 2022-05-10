import { Text } from '@gnosis.pm/safe-react-components'
import { ThemeColors } from '@gnosis.pm/safe-react-components/dist/theme'
import { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { getExplorerInfo } from 'src/config'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { ADDRESS_BOOK_DEFAULT_NAME } from 'src/logic/addressBook/model/addressBook'
import { sameString } from 'src/utils/strings'

interface AddressInfoProps {
  address: string
  title?: string
  name?: string
  logoUri?: string
  color?: ThemeColors
}

const AddressInfo = ({ address, title, name, logoUri, color }: AddressInfoProps): ReactElement => {
  const addessBookName = useSelector((state) => addressBookEntryName(state, { address }))

  return (
    <>
      {title && (
        <Text size="xl" color={color}>
          {title}
        </Text>
      )}
      <PrefixedEthHashInfo
        hash={address}
        name={sameString(addessBookName, ADDRESS_BOOK_DEFAULT_NAME) ? name : addessBookName}
        showCopyBtn
        showAvatar
        textSize="lg"
        explorerUrl={getExplorerInfo(address)}
        customAvatar={logoUri || undefined}
      />
    </>
  )
}

export default AddressInfo
